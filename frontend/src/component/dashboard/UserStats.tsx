/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, Shield, Clock } from "lucide-react";

interface Props {
  users: any[];
  total: number;
}

export const UserStats = ({ users, total }: Props) => {
  const adminCount = users.filter((u) => u.role === "admin").length;
  const staffCount = users.filter((u) => u.role === "staff").length;

  const recentlyAdded = users.filter((u) => {
    const created = new Date(u.createdAt);
    const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const cards = [
    {
      title: "Total Users",
      value: total,
      icon: <Users size={20} />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: <Shield size={20} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Staff",
      value: staffCount,
      icon: <Users size={20} />,
      color: "from-orange-400 to-yellow-500",
    },
    {
      title: "Recently Added",
      value: recentlyAdded,
      icon: <Clock size={20} />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value}</h3>
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
