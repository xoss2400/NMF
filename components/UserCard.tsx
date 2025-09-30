export default function UserCard({ user }: { user: any }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl text-white">
      <h2 className="font-bold text-xl mb-2">{user.name}</h2>
      {/* Add more user info here */}
    </div>
  )
}
