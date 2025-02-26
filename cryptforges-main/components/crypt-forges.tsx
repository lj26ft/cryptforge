import CryptForge from "./crypt-forge"

export default function CryptForges() {
  return (
    <div className="space-y-12">
      <CryptForge faction="Angelic" title="Angelic Sepulcher" />
      <CryptForge faction="Human" title="Human Forge" />
      <CryptForge faction="Demonic" title="Demonic Crypt" />
    </div>
  )
}

