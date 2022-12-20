// // SPDX-License-Identifier: MIT

// ========================================== //
//            Butts on Canto 2022             //
//           On-Chain SVG Renderer            //
// ========================================== //
//                                            // 
//     http://twitter.com/buttsoncanto        //
//                                            // 
// ========================================== //

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Base64.sol";

contract ButtRenderer {

  string[4] private COLORS = ["#EF476FFF", "#FFBC21", "#06D6A0FF", "#118AB2FF"];
  uint16[420] public indexesToOffsets = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 31, 33, 34, 35, 37, 39, 40, 42, 43, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 68, 70, 73, 74, 76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 113, 114, 115, 117, 118, 119, 120, 121, 123, 124, 125, 126, 127, 129, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 151, 152, 153, 154, 156, 157, 159, 160, 161, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 182, 183, 184, 185, 186, 188, 190, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 210, 211, 212, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 238, 239, 240, 241, 242, 243, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 290, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 317, 318, 320, 322, 323, 325, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 359, 360, 361, 362, 363, 364, 366, 367, 368, 370, 371, 373, 374, 375, 376, 377, 378, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 401, 402, 403, 405, 406, 407, 408, 409, 411, 412, 414, 415, 416, 417, 418, 420, 422, 423, 424, 425, 426, 428, 429, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 464, 465, 466, 468, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483];
  uint8[420] public indexesToLength = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 2, 1, 3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  string[484] public BUTTS = ["dog", "seahorse", "arctic", "fox", "goose", "goat", "mastodon", "anteater", "lobster", "woodpecker", "blue", "jay", "dung", "beetle", "orc", "ground", "shark", "locust", "fowl", "dinosaur", "slug", "gopher", "basilisk", "skunk", "bobcat", "duck", "imp", "star", "fox", "yellow", "perch", "giant", "panda", "opossum", "clam", "sleeping", "dog", "polar", "bear", "weasel", "grizzly", "bear", "porlock", "black", "widow", "spider", "ape", "marsupial", "marmoset", "giant", "squid", "mackerel", "coyote", "stoat", "walrus", "leech", "tuna", "llama", "blue", "bird", "crawdad", "elephant", "finch", "hobbit", "salamander", "lynx", "star-nosed", "mole", "english", "pointer", "great", "white", "shark", "limpet", "rainbow", "trout", "shark", "heckin'", "chonker", "quelea", "gamefowl", "leopon", "badger", "eel", "tarantula", "bug", "gibbon", "pigeon", "iguana", "lion", "reindeer", "jellyfish", "snail", "wren", "mink", "scorpion", "horse", "sea", "slug", "cuckoo", "lizard", "unicorn", "mule", "ptarmigan", "damselfly", "moose", "deer", "manatee", "bedbug", "firefly", "dove", "lab", "rat", "dormouse", "dingo", "prairie", "dog", "anaconda", "crane", "nightingale", "mammal", "panthera", "hybrid", "impala", "marlin", "cardinal", "parakeet", "hammerhead", "shark", "ostrich", "panther", "gerbil", "stingray", "possum", "rat", "catshark", "wombat", "vampire", "squid", "magpie", "gecko", "lemur", "mockingbird", "cantoe", "tiglon", "snipe", "halibut", "clabbert", "canadian", "tree", "frog", "troll", "gazelle", "cockroach", "guinea", "pig", "whippet", "humpback", "whale", "tortoise", "ladybug", "lazy", "cat", "wildebeest", "tiger", "rook", "toucan", "orca", "chinchilla", "boa", "mandrill", "angelfish", "cattle", "flamingo", "kangaroo", "lemming", "macaw", "rooster", "lamprey", "rabbit", "sperm", "whale", "mouse", "mongoose", "prawn", "mollusk", "praying", "mantis", "manta", "ray", "sea", "lion", "eagle", "fly", "bee", "sasquatch", "wolf", "frog", "planarian", "lark", "falcon", "bowtruckle", "cantoad", "xerinae", "ermine", "booby", "hornet", "aphid", "sea", "snail", "rattlesnake", "flea", "snow", "leopard", "hawk", "quail", "doge", "hummingbird", "turkey", "fox", "cricket", "donkey", "penguin", "earwig", "whale", "antelope", "chuckle", "bass", "albatross", "bat", "gnobe", "termite", "partridge", "goldfish", "cougar", "doggo", "spider", "monkey", "lungfish", "boar", "centipede", "grasshopper", "wizard", "steelhead", "trout", "viper", "sawfish", "turtle", "vicuna", "centaur", "warbler", "anglerfish", "python", "cryptoad", "butterfly", "pig", "buzzard", "worm", "hare", "quokka", "marten", "catfish", "rodent", "cow", "meadowlark", "cat", "big", "dog", "beetle", "echidna", "aardvark", "moth", "koala", "hamster", "chupacabra", "canid", "pinniped", "hermit", "crab", "vulture", "spider", "minnow", "mosquito", "barracuda", "pheasant", "tapir", "raccoon", "chameleon", "bald", "eagle", "sockeye", "salmon", "mooncalf", "harrier", "jay", "panda", "minx", "giraffe", "swan", "baboon", "yak", "haddock", "piranha", "salmon", "sheep", "peacock", "roundworm", "criminal", "chizpurfle", "whitefish", "swallow", "meerkat", "caribou", "ferret", "yeti", "ground", "sloth", "sparrow", "fruit", "bat", "mountain", "goat", "perch", "peregrine", "falcon", "blue", "whale", "grouse", "crayfish", "spoonbill", "gull", "squid", "fairy", "shrew", "starfish", "guppy", "reptile", "trout", "raven", "bobolink", "squirrel", "jackal", "chipmunk", "capybara", "newt", "goblin", "urial", "ant", "krill", "jabberknoll", "bird", "carp", "wallaby", "puffin", "porpoise", "ocelot", "crow", "arctic", "wolf", "cobra", "javelina", "scallop", "caterpillar", "shrimp", "pilot", "whale", "alligator", "alpaca", "black", "panther", "ent", "bored", "ape", "loon", "mole", "dragonfly", "gorilla", "snake", "beaked", "whale", "pike", "swift", "otter", "chicken", "monkey", "coral", "elf", "sturgeon", "egret", "leopard", "toad", "emu", "swordtail", "zebra", "clownfish", "tick", "parrot", "wildcat", "ghoul", "monitor", "lizard", "louse", "porcupine", "komodo", "dragon", "pony", "ox", "dragon", "thrush", "crypto", "dick", "muskox", "tasmanian", "devil", "chimpanzee", "dolphin", "cod", "orangutan", "whooping", "crane", "fancy", "mouse", "beaver", "hyena", "elk", "barnacle", "fancy", "rat", "buffalo", "gila", "monster", "pelican", "bear", "roadrunner", "silkworm", "hippopotamus", "parrotfish", "narwhal", "stork", "tarsier", "marmot", "kingfisher", "platypus", "armadillo", "crocodile", "tiger", "shark", "wasp", "heron", "longneck", "bonobo", "sloth", "camel", "owl", "rhinoceros", "cyclops", "cicada", "octopus", "hedgehog", "landfowl", "bison", "kiwi", "water", "buffalo", "chickadee", "wolverine", "bali", "cattle", "vampire", "bat", "condor", "blackbird", "puma", "cheetah", "swordfish", "earthworm", "aardwolf", "grinylow", "herring", "crab", "peafowl", "bandicoot", "jaguar", "silverfish"];
  
  mapping (uint256 => string[]) dyToLengths;

  constructor() {
    dyToLengths[1] = ['0', '55'];
    dyToLengths[2] = ['0', '50', '96'];
    dyToLengths[3] = ['0', '50', '96', '145'];    
  }  

  function tokenURI(uint256 tokenId, bool isOnChain, string calldata baseURI) public view returns (string memory) {
    string memory name = nameForTokenId(tokenId);
    string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "', name, '", "attributes": [{"trait_type": "Butt?", "value": "Yes!"}, {"trait_type": "Type", "value": "', name ,'"} ], "description": "An NFT collection finally bringing a variety of butts - both real and imagined - to the Canto blockchain.", "image": "', imageForTokenID(tokenId, isOnChain, baseURI), '"}'))));
    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  function imageForTokenID(uint256 tokenId, bool isOnChain, string calldata baseURI) public view returns (string memory) {
    if(isOnChain){
      return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(onChainImage(tokenId)))));
    } else {
      return string(abi.encodePacked(baseURI, _toString(tokenId), '.png'));            
    }
  }

  function onChainImage(uint256 tokenId) view public returns (string memory) {
    uint256 len = bytes(nameForTokenId(tokenId)).length;
    string memory fontSize = len == 12 ? '48' : '60';
    string memory color = colorForTokenId(tokenId);

    string memory l1 = string.concat(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base {font-weight: bold; fill: white; font-family: sans-serif; font-size:',
      fontSize,
      'px; } .small { fill:',
      color,
      '; font-family: serif; font-size: 22px; }</style><rect rx="15" width="100%" height="100%" fill="black" /> <text text-anchor="middle" class="base">');

      string memory startP = startPForTokenId(tokenId);
      string[] memory positions = dyToLengths[indexesToLength[tokenId]];
      string memory spans = '';
      unchecked {
        for(uint256 n = 0; n < indexesToLength[tokenId];) {
          spans = string.concat(spans, string(abi.encodePacked('<tspan x="50%" y="', startP, '%" dy="', positions[n], 'px">', BUTTS[indexesToOffsets[tokenId] + n], '</tspan>')));
          n++;
        }
      }
      spans = string.concat(spans, string(abi.encodePacked('<tspan x="50%" y="', startP, '%" dy="', positions[indexesToLength[tokenId]], 'px">butt</tspan>')));
      string memory subOffset = subPForTokenId(tokenId);
      return string.concat(l1, spans, '</text><text x="50%" y="', subOffset, '" text-anchor="middle" class="small">preserved for eternity on</text><text x="50%" dy="7%" y="', subOffset, '" text-anchor="middle" class="small">the Canto blockchain</text></svg>');
  }
  
  function startPForTokenId(uint256 tokenId) internal view returns (string memory){
    if(indexesToLength[tokenId] == 3){
      return '26';
    } else if(indexesToLength[tokenId] == 2){
      return '32';
    } else {
      return '37';
    }    
  }

  function subPForTokenId(uint256 tokenId) internal view returns (string memory){
    if(indexesToLength[tokenId] == 3){
      return '77%';
    } else if(indexesToLength[tokenId] == 2){
      return '71%';
    } else {
      return '66%';
    }    
  }  

  // Make sure the background color matches the off-chain PNG.
  function colorForTokenId(uint256 tokenId) public view returns (string memory) {
    uint256 len = bytes(nameForTokenId(tokenId)).length;
    uint256 mod = len % 4;
    return COLORS[mod];
  }

  // Returns the flattened butt name, which we otherwise store in a data structure to make SVG rendering possible.
  function nameForTokenId(uint256 tokenId) public view returns (string memory) {
    string memory fullName;
    unchecked {
      uint256 max = indexesToOffsets[tokenId] + indexesToLength[tokenId];
      for(uint256 n = indexesToOffsets[tokenId]; n < max;) {
        if(n == max - 1){
          fullName = string.concat(fullName, BUTTS[n]);
        } else {
          fullName = string.concat(fullName, string(abi.encodePacked(BUTTS[n], " ")));
        }
        n++;
      }
    }    
    return fullName;
  }

  // Taken from ERC721A!
  //
  /**
   * @dev Converts a uint256 to its ASCII string decimal representation.
   */
  function _toString(uint256 value) internal pure virtual returns (string memory str) {
      assembly {
          // The maximum value of a uint256 contains 78 digits (1 byte per digit), but
          // we allocate 0xa0 bytes to keep the free memory pointer 32-byte word aligned.
          // We will need 1 word for the trailing zeros padding, 1 word for the length,
          // and 3 words for a maximum of 78 digits. Total: 5 * 0x20 = 0xa0.
          let m := add(mload(0x40), 0xa0)
          // Update the free memory pointer to allocate.
          mstore(0x40, m)
          // Assign the `str` to the end.
          str := sub(m, 0x20)
          // Zeroize the slot after the string.
          mstore(str, 0)

          // Cache the end of the memory to calculate the length later.
          let end := str

          // We write the string from rightmost digit to leftmost digit.
          // The following is essentially a do-while loop that also handles the zero case.
          // prettier-ignore
          for { let temp := value } 1 {} {
              str := sub(str, 1)
              // Write the character to the pointer.
              // The ASCII index of the '0' character is 48.
              mstore8(str, add(48, mod(temp, 10)))
              // Keep dividing `temp` until zero.
              temp := div(temp, 10)
              // prettier-ignore
              if iszero(temp) { break }
          }

          let length := sub(end, str)
          // Move the pointer 32 bytes leftwards to make room for the length.
          str := sub(str, 0x20)
          // Store the length.
          mstore(str, length)
      }
  }


}
