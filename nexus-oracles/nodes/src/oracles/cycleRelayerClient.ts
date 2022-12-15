// import config
import * as dotenv from "dotenv";
import {BigNumber, Contract, Wallet} from "ethers";
import axios from "axios";
import Config from "../Config";
import {JsonRpcProvider} from "@ethersproject/providers";
import cycleRelayerAbi from "../abis/CycleRelayer.json";

dotenv.config({ path: __dirname+"/../../.env" });

const provider = new JsonRpcProvider(Config.rpcUrl);

if (undefined === process.env.NODE_CYCLERELAYER_PRIVATE_KEY || process.env.NODE_CYCLERELAYER_PRIVATE_KEY.length === 0) {
    process.exit(1);
}

// initialize wallet
const wallet = new Wallet(process.env.NODE_CYCLERELAYER_PRIVATE_KEY, provider);

const cycleRelayerContract = new Contract(Config.contracts.cycleRelayer, cycleRelayerAbi, wallet);

const { host } = Config;

const CycleRelayerClient = {
    start: async () => {
        await CycleRelayerClient.sync();
        await CycleRelayerClient.listen();
    },

    sync: async () => {
        // check if a new cycle can be pushed
        // if CycleRelayer.nextCycleBlock() <= block.number => relay latest cycle
        const nextCycleBlock: BigNumber = await cycleRelayerContract.nextCycleBlock();

        if (nextCycleBlock.lte(await provider.getBlockNumber())) {
            // relay new block
            console.log("Relaying new cycle...");

            await CycleRelayerClient.transmitLatestCycleId();
        }

        // synced!
        console.info("Node synced!");
    },

    listen: async () => {
        provider.on("block", (blockNumber) => {
            (async () => {
                const nextCycleBlock: BigNumber = await cycleRelayerContract.nextCycleBlock();

                console.info("New block: "+blockNumber);

                console.log("Next cycle block: "+nextCycleBlock.toString());

                if (nextCycleBlock.sub(1).lte(blockNumber)) {
                    await CycleRelayerClient.transmitLatestCycleId();
                }
            })();
        });
    },

    transmitLatestCycleId: async () => {
        // Get random value
        const response = await axios({
            method: "GET",
            url: "https://" + host + "/" + Config.drandChainId + "/public/latest",
            responseType: "json"
        });

        const drandCycleId: number = response.data.round;

        const hasBeenTransmitted: boolean = await cycleRelayerContract.cyclesReverseResolver(drandCycleId) !== 0;

        if (!hasBeenTransmitted) {
            // prepare tx fees
            const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

            // transmit
            const transaction = await cycleRelayerContract.transmit(drandCycleId, {
                nonce: await provider.getTransactionCount(await wallet.getAddress()),
                gasLimit: 120000,
                maxFeePerGas,
                maxPriorityFeePerGas,
            });

            const receipt = await transaction.wait(1);

            const newCycleTransmission = {
                transactionHash: receipt.transactionHash,
                drandCycleId: drandCycleId,
                nexusCycleId: await cycleRelayerContract.cyclesReverseResolver(drandCycleId),
                costs: {
                    gasUsed: receipt.gasUsed.toString(),
                    effectiveGasPrice: receipt.effectiveGasPrice.toString(),
                }
            };

            // TODO: (optional) log `newCycleTransmission` in a DB or something for analytics
            console.info("New Cycle Transmission");
            console.info(newCycleTransmission);
        }
    },
};

export default CycleRelayerClient;
