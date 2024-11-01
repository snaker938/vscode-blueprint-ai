import React from 'react';
import { useNode } from '@craftjs/core';

interface SearchBoxProps {
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> & { craft?: any } = ({
  placeholder,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <input
      type="text"
      ref={(ref) => connect(drag(ref))}
      placeholder={placeholder}
    />
  );
};

SearchBox.craft = {
  displayName: 'Search Box',
  props: {
    placeholder: 'Search...',
  },
};
