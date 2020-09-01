import * as React from 'react';



export const EventViewer:React.FC = () => {
    const [closedEvents, setClosedEvents] = React.useState<fin.SystemBaseEvent[]>([]);
    const [startedEvents, setStartedEvents] = React.useState<fin.SystemBaseEvent[]>([]);
    React.useEffect(() => {
        fin.System.addListener(`application-closed`, (evt) => {
            setClosedEvents(prevState => [evt, ...prevState]);
        });
        fin.System.addListener(`application-started`, (evt) => {
            setStartedEvents(prevState => [evt, ...prevState]);
        });
    }, []);

    return (<div>
        <h1>{`application-closed Events: `}</h1>
        <ul>
            {closedEvents.map(evt => {
                <pre>{JSON.stringify(evt, null, 1)}</pre>
            })}
        </ul>
        <h1>{`application-started Events: `}</h1>
        <ul>
            {startedEvents.map(evt => {
                <pre>{JSON.stringify(evt, null, 1)}</pre>
            })}
        </ul>
    </div>)
}

