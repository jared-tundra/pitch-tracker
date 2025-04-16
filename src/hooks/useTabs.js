import { useState } from 'react';
import PitchTrackingForm from '../PitchTrackingForm';
import CurrentSession from '../CurrentSession';

const useTabs = () => {
  const [activeTab, setActiveTab] = useState('form');

  const renderContent = () => {
    switch (activeTab) {
      case 'form':
        return <PitchTrackingForm setActiveTab={setActiveTab} />;
      case 'session':
        return <CurrentSession setActiveTab={setActiveTab} />;
      default:
        return <PitchTrackingForm setActiveTab={setActiveTab} />;
    }
  };

  return { activeTab, setActiveTab, renderContent };
};

export default useTabs;
