import * as dotenv from "dotenv";
import {BigNumber, Contract, utils, Wallet} from "ethers";
import axios from "axios";
import Config from "../Config";
import {JsonRpcProvider} from "@ethersproject/providers";
import cycleRelayerAbi from "../abis/CycleRelayer.json";
import randomnessOracleAbi from "../abis/RandomnessOracle.json";
import {isHexString} from "ethers/lib/utils";

dotenv.config({ path: __dirname+"/../../.env" });

const provider = new JsonRpcProvider(Config.rpcUrl);

if (undefined === process.env.NODE_RANDOMNESSORACLE_PRIVATE_KEY || process.env.NODE_RANDOMNESSORACLE_PRIVATE_KEY.length === 0) {
    console.error("Invalid private key");
    process.exit(1);
}

// initialize wallet
const wallet = new Wallet(process.env.NODE_RANDOMNESSORACLE_PRIVATE_KEY, provider);

const cycleRelayerContract = new Contract(Config.contracts.cycleRelayer, cycleRelayerAbi, wallet);
const randomnessOracleContract = new Contract(Config.contracts.randomnessOracle, randomnessOracleAbi, wallet);

const { host } = Config;

const RandomnessOracleClient = {
    start: async () => {
        await RandomnessOracleClient.sync();
        await RandomnessOracleClient.listen();
    },
    sync: async (): Promise<void> => {
        // check if latest cycle has a random value
        // if not, submit random value from drand
        const nextCycleId: BigNumber = BigNumber.from(await cycleRelayerContract.nextCycleId());
        const currentCycleId: BigNumber = nextCycleId.eq(0) ? BigNumber.from(0) : nextCycleId.sub(1);

        // check if current cycle has a randomValue
        const randomValueOfCurrentCycle: BigNumber = await randomnessOracleContract.randomValues(currentCycleId);

        // if current cycle doesnt have a random value, fetch and transmit value
        if (randomValueOfCurrentCycle.eq(0)) {
            // get random value and prefix with 0x to
            const drandCycleId = await cycleRelayerContract.cycles(currentCycleId);
            const randomValue = await RandomnessOracleClient.getRandomValueFromSource(drandCycleId);

            // transmit to oracle
            await RandomnessOracleClient.transmit(currentCycleId, randomValue);
        }
    },
    listen: async (): Promise<void> => {
        provider.on({
            address: Config.contracts.cycleRelayer,
            topics: [
                utils.id("NewCycle(address,uint32,uint32)")
            ]
        }, (log) => {
            (async () => {
                // get cycleId and drandCycleId from the newly transmitted on-chain cycle
                const { cycleId, drandCycleId } = cycleRelayerContract.interface.parseLog(log).args;

                // check that consensus hasnt been made on the random value on-chain
                const randomValueOfOnChainCycle: BigNumber = await randomnessOracleContract.randomValues(cycleId);

                // get random value and prefix with 0x to
                if (randomValueOfOnChainCycle.eq(0)) {
                    const randomValue = await RandomnessOracleClient.getRandomValueFromSource(drandCycleId);

                    // transmit to oracle
                    await RandomnessOracleClient.transmit(cycleId, randomValue);
                }
            })();
        });
    },
    getRandomValueFromSource: async (drandCycleId: BigNumber): Promise<BigNumber> => {
        // Get random value
        const response = await axios({
            method: "GET",
            url: "https://"+host+"/"+Config.drandChainId+"/public/"+drandCycleId.toString(),
            responseType: "json"
        });

        // get random value and prefix with 0x to
        const randomValue: string = "0x"+response.data.randomness;

        if ( ! isHexString(randomValue)) {
            console.error("Random value obtained is not a valid hex string: "+randomValue);
            process.exit(1);
        }

        return BigNumber.from(randomValue);
    },
    transmit: async (cycleId: BigNumber, randomValue: BigNumber): Promise<void> => {
        // prepare tx fees
        const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

        // transmit
        const transaction = await randomnessOracleContract.transmit(cycleId, randomValue, {
            nonce: await provider.getTransactionCount(await wallet.getAddress()),
            gasLimit: 120000,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });

        const receipt = await transaction.wait(1);

        const newRandomnessTransmission = {
            transactionHash: receipt.transactionHash,
            nexusCycleId: cycleId.toString(),
            drandCycleId: (await cycleRelayerContract.cycles(cycleId)).toString(),
            randomValue: randomValue.toString(),
            randomValueHexString: randomValue.toHexString(),
            costs: {
                gasUsed: receipt.gasUsed.toString(),
                effectiveGasPrice: receipt.effectiveGasPrice.toString(),
            }
        };

        // TODO: (optional) log `newRandomnessTransmission` in a DB or something for analytics
        console.info("New Randomness Transmission");
        console.info(newRandomnessTransmission);
    },
};

export default RandomnessOracleClient;
