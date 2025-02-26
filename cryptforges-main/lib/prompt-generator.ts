type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
type Category = "Character" | "Item" | "Support"
type Faction = "Angelic" | "Human" | "Demonic"

interface PromptTemplate {
  base: string
  rarityAdjectives: Record<Rarity, string[]>
  epicDescriptors: string[]
  legendaryDescriptors: string[]
}

const promptTemplates: Record<Faction, Record<Category, PromptTemplate>> = {
  Angelic: {
    Character: {
      base: "{rarity} {adjective} angelic {type} with {feature}, {action}, {setting}",
      rarityAdjectives: {
        Common: ["serene", "gentle", "peaceful"],
        Uncommon: ["radiant", "luminous", "glowing"],
        Rare: ["majestic", "resplendent", "awe-inspiring"],
        Epic: ["celestial", "divine", "transcendent"],
        Legendary: ["omnipotent", "all-encompassing", "reality-shaping"],
      },
      epicDescriptors: [
        "multiple pairs of shimmering wings",
        "eyes glowing with divine light",
        "armor forged from celestial metals",
        "surrounded by a chorus of cherubim",
        "wielding weapons of pure light",
      ],
      legendaryDescriptors: [
        "aura of pure creation",
        "reality-altering presence",
        "embodiment of cosmic order",
        "voice that speaks universes into existence",
        "form shifting between countless divine aspects",
      ],
    },
    Item: {
      base: "{rarity} {adjective} {item} {feature}, {effect}",
      rarityAdjectives: {
        Common: ["simple", "blessed", "holy"],
        Uncommon: ["holy", "sacred", "enchanted"],
        Rare: ["sacred", "powerful", "divine"],
        Epic: ["divine", "miraculous", "celestial"],
        Legendary: ["celestial", "reality-bending", "godly"],
      },
      epicDescriptors: [
        "pulsing with holy energy",
        "inscribed with ancient divine script",
        "forged in the heart of a dying star",
        "emits a soft, holy glow",
        "surrounded by a faint aura",
      ],
      legendaryDescriptors: [
        "reality-warping",
        "universe-shaping",
        "existence-defining",
        "capable of rewriting reality",
        "emits a blinding light",
      ],
    },
    Support: {
      base: "{rarity} {adjective} {effect} {action}, {result}",
      rarityAdjectives: {
        Common: ["gentle", "soothing", "mild"],
        Uncommon: ["soothing", "calming", "healing"],
        Rare: ["powerful", "miraculous", "restorative"],
        Epic: ["miraculous", "divine", "life-giving"],
        Legendary: ["world-altering", "reality-warping", "universe-altering"],
      },
      epicDescriptors: [
        "cascading waves of divine energy",
        "chorus of celestial beings",
        "reality-bending miracles",
        "soft, healing light",
        "gentle, calming breeze",
      ],
      legendaryDescriptors: [
        "cosmic-scale divine intervention",
        "fundamental laws of reality being rewritten",
        "new universe being born",
        "capable of healing any wound",
        "emits a powerful, healing aura",
      ],
    },
  },
  Human: {
    Character: {
      base: "{rarity} {adjective} human {type} {feature}, {action}, {setting}",
      rarityAdjectives: {
        Common: ["determined", "brave", "courageous"],
        Uncommon: ["skilled", "talented", "capable"],
        Rare: ["exceptional", "gifted", "remarkable"],
        Epic: ["legendary", "heroic", "mythical"],
        Legendary: ["mythical", "history-defining", "world-altering"],
      },
      epicDescriptors: [
        "bearing ancient family heirlooms",
        "marked by prophecy",
        "wielding forbidden knowledge",
        "master of many skills",
        "possessing ancient wisdom",
      ],
      legendaryDescriptors: [
        "destiny-shaping",
        "history-defining",
        "legend-incarnate",
        "capable of changing the world",
        "possessing unparalleled power",
      ],
    },
    Item: {
      base: "{rarity} {adjective} {item} {feature}, {effect}",
      rarityAdjectives: {
        Common: ["practical", "useful", "reliable"],
        Uncommon: ["well-crafted", "durable", "efficient"],
        Rare: ["masterwork", "powerful", "effective"],
        Epic: ["legendary", "mythical", "powerful"],
        Legendary: ["mythical", "reality-bending", "world-altering"],
      },
      epicDescriptors: [
        "infused with the spirits of past heroes",
        "forged using lost techniques",
        "blessed by forgotten gods",
        "emits a faint glow",
        "surrounded by a protective aura",
      ],
      legendaryDescriptors: [
        "reality-shaping",
        "destiny-altering",
        "world-changing",
        "capable of rewriting history",
        "emits a powerful, protective aura",
      ],
    },
    Support: {
      base: "{rarity} {adjective} {effect} {action}, {result}",
      rarityAdjectives: {
        Common: ["useful", "helpful", "beneficial"],
        Uncommon: ["effective", "reliable", "efficient"],
        Rare: ["powerful", "game-changing", "transformative"],
        Epic: ["game-changing", "revolutionary", "world-altering"],
        Legendary: ["world-altering", "reality-bending", "universe-altering"],
      },
      epicDescriptors: [
        "unleashing the full potential of humanity",
        "channeling the collective will of the people",
        "defying the laws of nature",
        "emits a soft, calming light",
        "surrounded by a protective aura",
      ],
      legendaryDescriptors: [
        "rewriting the course of history",
        "challenging the gods themselves",
        "reshaping the very fabric of reality",
        "capable of changing the world",
        "emits a powerful, protective aura",
      ],
    },
  },
  Demonic: {
    Character: {
      base: "{rarity} {adjective} demonic {type} with {feature}, {action}, {setting}",
      rarityAdjectives: {
        Common: ["sinister", "wicked", "evil"],
        Uncommon: ["malevolent", "cruel", "ruthless"],
        Rare: ["terrifying", "fearsome", "horrifying"],
        Epic: ["nightmarish", "apocalyptic", "hellish"],
        Legendary: ["apocalyptic", "reality-warping", "universe-ending"],
      },
      epicDescriptors: [
        "flesh twisted by dark energies",
        "surrounded by souls of the damned",
        "radiating waves of pure terror",
        "wielding weapons of pure darkness",
        "eyes burning with hellfire",
      ],
      legendaryDescriptors: [
        "reality-corrupting",
        "existence-threatening",
        "universe-ending",
        "capable of destroying reality",
        "emits a powerful, destructive aura",
      ],
    },
    Item: {
      base: "{rarity} {adjective} {item} {feature}, {effect}",
      rarityAdjectives: {
        Common: ["cursed", "tainted", "wicked"],
        Uncommon: ["corrupted", "defiled", "unholy"],
        Rare: ["unholy", "powerful", "destructive"],
        Epic: ["abyssal", "hellish", "apocalyptic"],
        Legendary: ["apocalyptic", "reality-warping", "universe-ending"],
      },
      epicDescriptors: [
        "dripping with liquid nightmares",
        "whispering maddening secrets",
        "pulsing with the heartbeat of a dead god",
        "emits a faint, dark glow",
        "surrounded by a dark aura",
      ],
      legendaryDescriptors: [
        "reality-corrupting",
        "soul-consuming",
        "existence-ending",
        "capable of destroying souls",
        "emits a powerful, destructive aura",
      ],
    },
    Support: {
      base: "{rarity} {adjective} {effect} {action}, {result}",
      rarityAdjectives: {
        Common: ["dark", "shadowy", "sinister"],
        Uncommon: ["sinister", "evil", "malevolent"],
        Rare: ["horrifying", "terrifying", "destructive"],
        Epic: ["cataclysmic", "apocalyptic", "hellish"],
        Legendary: ["apocalyptic", "reality-warping", "universe-ending"],
      },
      epicDescriptors: [
        "tearing holes in the fabric of reality",
        "summoning entities from beyond the veil",
        "corrupting the very laws of nature",
        "emits a faint, dark glow",
        "surrounded by a dark aura",
      ],
      legendaryDescriptors: [
        "unmaking creation itself",
        "bringing about the end of all existence",
        "shattering the boundaries between all realities",
        "capable of destroying universes",
        "emits a powerful, destructive aura",
      ],
    },
  },
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function generatePrompt(faction: Faction, category: Category, rarity: Rarity): string {
  const template = promptTemplates[faction][category]
  const adjective =
    template.rarityAdjectives[rarity][Math.floor(Math.random() * template.rarityAdjectives[rarity].length)]

  let prompt = template.base
    .replace("{rarity}", rarity)
    .replace("{adjective}", adjective)
    .replace("{type}", category.toLowerCase())
    .replace("{feature}", getRandomFeature(faction, category))
    .replace("{action}", getRandomAction(faction, category))
    .replace("{setting}", getRandomSetting(faction))
    .replace("{item}", getRandomItem(faction, category))
    .replace("{effect}", getRandomEffect(faction, category))

  if (rarity === "Epic" || rarity === "Legendary") {
    const descriptors = rarity === "Epic" ? template.epicDescriptors : template.legendaryDescriptors
    prompt += `, ${descriptors[Math.floor(Math.random() * descriptors.length)]}`
  }

  if (rarity === "Legendary") {
    prompt = addAlliteration(prompt)
  }

  return capitalize(prompt)
}

function getRandomFeature(faction: Faction, category: Category): string {
  const features = {
    Angelic: ["glowing wings", "halo of light", "radiant aura"],
    Human: ["determined eyes", "battle-worn armor", "ancestral weapon"],
    Demonic: ["twisted horns", "burning eyes", "shadowy aura"],
  }
  return features[faction][Math.floor(Math.random() * features[faction].length)]
}

function getRandomAction(faction: Faction, category: Category): string {
  const actions = {
    Angelic: ["wielding a radiant weapon", "casting divine magic", "blessing allies"],
    Human: ["leading a charge", "devising strategies", "inspiring troops"],
    Demonic: ["corrupting the land", "summoning dark minions", "spreading terror"],
  }
  return actions[faction][Math.floor(Math.random() * actions[faction].length)]
}

function getRandomSetting(faction: Faction): string {
  const settings = {
    Angelic: ["in celestial realms", "amidst golden clouds", "in a divine sanctuary"],
    Human: ["on a battlefield", "in a fortified castle", "in a mystical forest"],
    Demonic: ["in the depths of hell", "in a corrupted wasteland", "amidst swirling chaos"],
  }
  return settings[faction][Math.floor(Math.random() * settings[faction].length)]
}

function getRandomItem(faction: Faction, category: Category): string {
  const items = {
    Angelic: ["holy relic", "divine weapon", "celestial artifact"],
    Human: ["enchanted sword", "magical tome", "ancient amulet"],
    Demonic: ["cursed weapon", "soul-trapping gem", "forbidden grimoire"],
  }
  return items[faction][Math.floor(Math.random() * items[faction].length)]
}

function getRandomEffect(faction: Faction, category: Category): string {
  const effects = {
    Angelic: ["radiating holy light", "purifying corruption", "granting divine protection"],
    Human: ["enhancing abilities", "revealing hidden truths", "turning the tide of battle"],
    Demonic: ["corrupting the pure", "devouring souls", "spreading chaos and destruction"],
  }
  return effects[faction][Math.floor(Math.random() * effects[faction].length)]
}

function addAlliteration(prompt: string): string {
  const words = prompt.split(" ")
  const firstLetter = words[0].charAt(0).toLowerCase()
  const alliterativeWords = [
    "luminous",
    "radiant",
    "glorious",
    "majestic",
    "mighty",
    "valiant",
    "heroic",
    "honorable",
    "legendary",
    "mythical",
    "powerful",
    "fearsome",
    "terrifying",
    "dreadful",
    "malevolent",
    "sinister",
    "diabolical",
  ]

  const matchingWords = alliterativeWords.filter((word) => word.startsWith(firstLetter))
  if (matchingWords.length > 0) {
    const chosenWord = matchingWords[Math.floor(Math.random() * matchingWords.length)]
    words.splice(1, 0, chosenWord)
  }

  return words.join(" ")
}

export function generateImagePrompt(faction: Faction, category: Category, rarity: Rarity, customization = ""): string {
  let prompt = generatePrompt(faction, category, rarity)
  if (customization) {
    prompt += `. ${customization}`
  }
  return prompt
}

