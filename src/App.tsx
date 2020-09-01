import * as React from 'react';

import {EventViewer} from './EventViewer';

export const App:React.FC = () => {
    const [versions, setVersions] = React.useState<string[]>([]);
    const [selectedVersion, setSelectedVersion] = React.useState<string>('');

    React.useEffect(() => {
        fetch('/versions.json')
        .then((resp) => resp.json())
        .then((versions) => {
            setVersions(versions);
            setSelectedVersion(versions[0]);
        });
    }, []);

    const onLaunchApp: React.MouseEventHandler = (evt) => {
        console.log('Launching app with version ', selectedVersion);
        fin.Application.startFromManifest(`${location.origin}/app.json?version=${selectedVersion}`);
    }

    const onVersionChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
        setSelectedVersion(evt.target.value);
    }

    return (<div>
        <h1>Create new app: </h1>
        <label htmlFor="version-selector">Runtime Version: </label>
        <input type="text" id="version-selector" list="versions" value={selectedVersion} onChange={onVersionChange}/>
        <datalist id="versions">
            {versions.map(version => <option value={version} key={version}>{version}</option>)}
        </datalist>
        <button onClick={onLaunchApp} >Launch</button>
        <br/>
        <EventViewer/>
    </div>);
};