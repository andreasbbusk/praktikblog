import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface BlogEntryProps {
  title: string;
  content: string;
  createdAt: string;
  type: string;
  stateOfMind: string;
  onClick: () => void;
}

const BlogEntry: React.FC<BlogEntryProps> = ({
  title,
  content,
  createdAt,
  type,
  stateOfMind,
  onClick,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card onClick={onClick} className="cursor-pointer">
      <CardHeader>
        <h3 className="text-lg font-bold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p>{truncateText(content, 100)}</p>
        <p className="text-sm text-gray-500">Type: {type}</p>
        <p className="text-sm text-gray-500">State of Mind: {stateOfMind}</p>
        <p className="text-sm text-gray-500">Created: {createdAt}</p>
      </CardContent>
    </Card>
  );
};

export default BlogEntry;
