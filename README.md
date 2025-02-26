# CryptForges

CryptForges is a blockchain-based NFT (Non-Fungible Token) game and marketplace built on the XRP Ledger. It allows users to create, trade, and battle with unique digital assets in a fantasy-themed world.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Contributing](#contributing)
- [License](#license)

## Features

- **NFT Minting**: Create unique NFTs with different factions, categories, and rarities.
- **AI-Generated Images**: Utilize AI to generate unique images for each NFT.
- **Marketplace**: Buy, sell, and trade NFTs with other players.
- **Battle System**: Engage in strategic card battles using your NFT collection.
- **Deck Building**: Create and manage decks for battles.
- **NFT Evolution**: Evolve your NFTs to increase their power and unlock new abilities.
- **Leaderboard**: Compete with other players and climb the ranks.
- **XUMM Wallet Integration**: Seamless integration with XUMM wallet for secure transactions on the XRP Ledger.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: Prisma (assumed, based on imports)
- **Blockchain**: XRP Ledger
- **Wallet Integration**: XUMM SDK
- **AI Image Generation**: OpenAI's DALL-E (assumed, based on code)
- **Testing**: Jest
- **State Management**: React Hooks
- **API Interactions**: Fetch API
- **Deployment**: Vercel (assumed, based on project structure)

## Project Structure

The project follows a typical Next.js structure with some additional directories:

- `/app`: Contains the main application pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and game logic
- `/pages/api`: API routes for backend functionality
- `/public`: Static assets
- `/xapp`: XUMM-specific functionality

Key files and directories:

- `app/page.tsx`: Main entry point of the application
- `components/crypt-forge.tsx`: Core component for NFT creation
- `components/nft-marketplace.tsx`: Marketplace interface
- `lib/battle-system.ts`: Game battle logic
- `lib/uri-token.ts`: NFT minting and IPFS integration
- `lib/xumm-hook.ts`: Custom hook for XUMM wallet integration

## Getting Started

To run CryptForges locally, follow these steps:

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/cryptforges.git
   cd cryptforges
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up environment variables:
   Create a \`.env.local\` file in the root directory and add the following variables:
   \`\`\`
   NEXT_PUBLIC_XUMM_API_KEY=your_xumm_api_key
   NEXT_PUBLIC_XUMM_API_SECRET=your_xumm_api_secret
   OPENAI_API_KEY=your_openai_api_key
   PINATA_JWT=your_pinata_jwt
   \`\`\`

4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Play

1. **Connect Wallet**: Use the XUMM wallet to connect to the game.
2. **Create NFTs**: Use the CryptForge to mint new NFTs by selecting faction, category, and customizing details.
3. **Build Decks**: Create decks using your minted NFTs for battles.
4. **Trade NFTs**: Use the marketplace to buy, sell, or trade NFTs with other players.
5. **Battle**: Engage in strategic card battles using your decks.
6. **Evolve NFTs**: As you progress, evolve your NFTs to increase their power and abilities.

## Contributing

Contributions to CryptForges are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: \`git checkout -b feature/your-feature-name\`
3. Make your changes and commit them: \`git commit -m 'Add some feature'\`
4. Push to the branch: \`git push origin feature/your-feature-name\`
5. Submit a pull request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

[MIT License](https://opensource.org/licenses/MIT)

