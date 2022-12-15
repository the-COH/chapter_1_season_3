import prompts from "prompts";

import CycleRelayerClient from "./oracles/cycleRelayerClient";
import RandomnessOracleClient from "./oracles/randomnessOracleClient";

(async () => {
    const response = await prompts({
        type: "select",
        name: "value",
        message: "Choose a client to start",
        choices: [
            {
                title: "CycleRelayer",
                description: "Run the CycleRelayer client and push drand cycle IDs on-chain",
                value: "CycleRelayer"
            },
            {
                title: "RandomnessOracle",
                description: "Run the RandomnessOracle client and push drand randomness values on-chain",
                value: "RandomnessOracle"
            },
        ],
        initial: 0
    });

    switch (response.value) {
        case "CycleRelayer":
            await CycleRelayerClient.start();
            break;

        case "RandomnessOracle":
            await RandomnessOracleClient.start();
            break;
    }
})();
