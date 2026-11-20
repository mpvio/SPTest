import React from 'react';
import './App.css';
import { createProfile, Profile, bannerTypes, getBannerFromProfile, setBannerOnProfile } from './models/profile';
import { BannerSummon } from './models/bannerSummon';

function App() {
  // load profiles from local storage
  const [profiles, setProfiles] = React.useState<Profile[]>(() => {
    const storedProfiles = localStorage.getItem('profiles');
    return storedProfiles ? JSON.parse(storedProfiles) : [];
  });

  // save profiles to local storage whenever they change
  React.useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  // active profile
  const [activeProfile, setActiveProfile] = React.useState<Profile | null>(null);

  // current banner
  const [currentBanner, setCurrentBanner] = React.useState<BannerSummon[] | null>(null);
  const [selectedBannerType, setSelectedBannerType] = React.useState('');

  // search profiles by name
  const getProfileByName = (name: string): Profile | undefined => {
    return profiles.find(profile => profile.name === name);
  }

  const [profileNamePlaceHolder, setProfileNamePlaceHolder] = React.useState('');

  const addProfile = () => {
    if (!profileNamePlaceHolder) {
      return;
    }

    const existingProfile = getProfileByName(profileNamePlaceHolder);
    if (existingProfile) {
      setActiveProfile(existingProfile);
      setSelectedBannerType('');
      setCurrentBanner(null);
    } else {
      const newProfile = createProfile(profileNamePlaceHolder);
      setProfiles(previousProfiles => [...previousProfiles, newProfile]);
      setActiveProfile(newProfile);
      setSelectedBannerType('');
      setCurrentBanner(null);
    }
    setProfileNamePlaceHolder('');
  };

  // for adding new summon
  const [newSummonPlaceholderID, setNewSummonPlaceHolderID] = React.useState('');

  const addSummon = (summonIDText: string) => {
    if (!activeProfile || !selectedBannerType || !summonIDText) {
      return;
    }

    const summonID = parseInt(summonIDText, 10);
    if (!Number.isFinite(summonID)) {
      return;
    }

    const lastPity = currentBanner && currentBanner.length > 0 ? currentBanner[currentBanner.length - 1].pity : 0;

    const newSummon: BannerSummon = {
      time: new Date(),
      id: summonID,
      pity: lastPity + 1,
    };

    const updatedBanner = [...(currentBanner || []), newSummon];
    const updatedProfile = setBannerOnProfile(activeProfile, selectedBannerType, updatedBanner);

    setCurrentBanner(updatedBanner);
    setActiveProfile(updatedProfile);
    setProfiles(profiles.map(profile =>
      profile.name === updatedProfile.name ? updatedProfile : profile
    ));
    setNewSummonPlaceHolderID('');
  };

  // export all profile to JSON
  function exportData() {
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profiles.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // import all profile from JSON
  function importData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProfiles: Profile[] = JSON.parse(e.target?.result as string);
        setProfiles(importedProfiles);
        setActiveProfile(null);
        setSelectedBannerType('');
        setCurrentBanner(null);
      } catch (error) {
        console.error('Error importing profiles:', error);
      }
    };
    reader.readAsText(file);
  }

  // clear local storage
  function clearData() {
    localStorage.removeItem('profiles');
    setProfiles([]);
    setActiveProfile(null);
    setSelectedBannerType('');
    setCurrentBanner(null);
  }


  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <p> Active Profile: {activeProfile ? activeProfile.name : "None"} </p>
        <p> {profiles.length} profile(s) </p>

        {/* create selector menu to select active profile*/}
        <select value={activeProfile?.name || ''} onChange={(e) => {
          const profile = getProfileByName(e.target.value);
          if (profile) {
            setActiveProfile(profile);
            setSelectedBannerType('');
            setCurrentBanner(null);
          } else {
            setActiveProfile(null);
            setSelectedBannerType('');
            setCurrentBanner(null);
          }
        }}>
          <option value="">Select Profile</option>
          {profiles.map(profile => (
            <option key={profile.name} value={profile.name}>
              {profile.name}
            </option>
          ))}
        </select>

        <p /> {/* line break */}

        <input type="text"
          placeholder="Enter profile name"
          onChange={(e) => setProfileNamePlaceHolder(e.target.value)}
        />

        <button type="button" 
        onClick={addProfile}>
          Add Profile
        </button>

        <p /> {/* line break */}

        <input type="number"
          placeholder="Enter summon ID"
          value={newSummonPlaceholderID}
          onChange={(e) => setNewSummonPlaceHolderID(e.target.value)}
        />

        <button type="button"
          onClick={() => addSummon(newSummonPlaceholderID)}>
          Add Summon
        </button>

        <p> Current Banner: {currentBanner ? currentBanner.length : "N/A"} items </p>

        {/* select current banner*/}
        <select value={selectedBannerType} onChange={(e) => {
          const bannerType = e.target.value;
          setSelectedBannerType(bannerType);
          setCurrentBanner(activeProfile && bannerType
            ? getBannerFromProfile(activeProfile, bannerType)
            : null);
        }}>
          <option value="">Select Banner</option>
          {bannerTypes.map(bannerType => (
            <option key={bannerType} value={bannerType}>
              {bannerType}
            </option>
          ))}
        </select>

        <p /> {/* line break */}

        <button type="button"
          onClick={exportData}>
          Export Profiles
        </button>

        <p> Import Profiles: </p>
        <input type="file" accept=".json" onChange={importData} />

        <p /> {/* line break */}
        <button type="button"
          onClick={clearData}>
          Clear All Data
        </button>

        <p /> {/* line break */}


        {/* current banner */}
        {currentBanner && (
          <div>
            <h3>Current Banner</h3>
            <ul>
              {currentBanner.map((banner, index) => (
                <li key={index}> Item: {banner.id}, Pity: {banner.pity} @ {banner.time.toLocaleString()} </li>
              ))}
            </ul>
          </div>
        )}

      {/* </header> */}
    </div>
  );
}

export default App;
