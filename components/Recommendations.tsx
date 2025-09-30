export default function Recommendations({ userTracks }: { userTracks: any[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Shared Recommendations</h2>
      {/* Taste merging and recommendations logic goes here */}
      <ul>
        {userTracks.slice(0, 3).map(track => (
          <li key={track.id}>{track.name} — {track.artists[0].name}</li>
        ))}
      </ul>
    </div>
  )
}
