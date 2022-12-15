const Config = {
    rpcUrl: process.env.RPC_URL || "",
    contracts: {
        cycleRelayer: "0xB7ca895F81F20e05A5eb11B05Cbaab3DAe5e23cd",
        randomnessOracle: "0xd0EC100F1252a53322051a95CF05c32f0C174354",
        randomnessConsumer: "0x2d13826359803522cCe7a4Cfa2c1b582303DD0B4"
    },
    nodes: {
        cycleRelayer: {
            privateKey: process.env.NODE_CYCLERELAYER_PRIVATE_KEY || ""
        },
        randomnessOracle: {
            privateKey: process.env.NODE_RANDOMNESSORACLE_PRIVATE_KEY || ""
        }
    },
    drandChainId: "8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce",
    hosts: {
        protocolLabs1: "api.drand.sh",
        protocolLabs2: "api2.drand.sh",
        protocolLabs3: "api3.drand.sh",
        cloudflare: "drand.cloudflare.com",
    },
    host: "api.drand.sh"
};

export default Config;
