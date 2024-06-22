import React from "react";

interface Community {
  communityId: string;
  name: string;
  logo: string;
  totalExperiencePoints: number;
  userCount: number;
}

interface LeaderboardProps {
  communities: Community[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ communities }) => {
  const splitPoint = Math.ceil(communities.length / 2);

  return (
    <div className="w-full mt-4 mx-auto">
      <h1 className="mb-4">Community Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="table-auto">
          <Table communities={communities.slice(0, splitPoint)} start={0} />
        </div>
        <div className="table-auto">
          <Table
            communities={communities.slice(splitPoint)}
            start={splitPoint}
          />
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  communities: Community[];
  start: number;
}

const Table: React.FC<TableProps> = ({ communities, start }) => {
  const medalEmoji: { [key: number]: string } = {
    0: "🥇",
    1: "🥈",
    2: "🥉",
  };

  return (
    <table className="w-full border-collapse ">
      <thead>
        <tr >
          <th scope="col">Rank</th>
          <th scope="col">Community</th>
          <th scope="col">Number of Users</th>
          <th scope="col">EXP</th>
        </tr>
      </thead>
      <tbody>
        {communities.map((entry, index) => (
          <tr
            key={entry.communityId}
            className={`odd:dark:bg-gray-800 odd:bg-gray-200 ${!(index+start) && "first-place"}`}
          >
            <td className="items-center px-2 py-1">
              {index + 1 + start} {medalEmoji[index + start]}
            </td>
            <td className="items-center px-8 py-1 flex justify-start gap-4">
              <img
                src={entry.logo}
                alt={entry.name}
                width="50"
                className="rounded-md"
              />
              {entry.name}
            </td>
            <td className="items-center px-8 py-1">{entry.userCount}</td>
            <td className="items-center px-8 py-1">
              {entry.totalExperiencePoints}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;
