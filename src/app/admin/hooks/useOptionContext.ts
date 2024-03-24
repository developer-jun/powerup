import React from 'react';
import OptionContext from '@/app/admin/contexts/optionContext';

export default function useOptionContext() {
  const context = React.useContext(OptionContext);
  if (context === null) {
    throw new Error('useOptionContext must be used within a Provider tag');
  }
  
  return context;
}
