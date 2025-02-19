import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types/tag";
import { motion } from "framer-motion";
import React from "react";

interface BookmarkTagProps {
  tags: Tag[];
}

const MAX_DISPLAY_TAGS = 3;

const BookmarkTag: React.FC<BookmarkTagProps> = ({ tags }) => {
  return (
    <motion.div
      className="flex flex-shrink-0 items-center gap-1.5 ml-4 mr-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}>
      {tags.slice(0, MAX_DISPLAY_TAGS).map((tag, index) => (
        <motion.div key={tag.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: index * 0.1 }}>
          <Badge className="text-sm whitespace-nowrap">{tag.fullPath}</Badge>
        </motion.div>
      ))}
      {tags.length > MAX_DISPLAY_TAGS && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: 0.3 }}>
          <Badge className="text-sm whitespace-nowrap">+{tags.length - MAX_DISPLAY_TAGS}</Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

BookmarkTag.displayName = "BookmarkTag";

export default BookmarkTag;
