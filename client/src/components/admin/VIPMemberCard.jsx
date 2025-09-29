import React from 'react';

const VIPMemberCard = ({ member, formatNumber }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        {member.avatar}
      </div>
      <div>
        <p className="font-medium text-sm">{member.name}</p>
        <p className="text-xs text-gray-500">{member.joinDate}</p>
      </div>
    </div>
    <p className="text-green-500 font-bold text-sm">
      RP {formatNumber(member.earnings)}
    </p>
  </div>
);

export default VIPMemberCard;
