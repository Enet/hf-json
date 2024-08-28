import './App.styl';

import {FieldDescription} from 'components/FieldDescription/FieldDescription';
import {TreeView} from 'components/TreeView/TreeView';
import {treeRootPath} from 'constants/tree';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {JsonData} from 'types/json';
import {TreeNodeEvent} from 'types/tree';
import {isJsonData, isJsonValue} from 'utils/json';

const initialTextData = '{}';

const renderFieldValue = (value?: JsonData) => {
    if (!isJsonData(value)) {
        return '';
    } else if (!isJsonValue(value)) {
        return value instanceof Array ? '[...]' : '{...}';
    }
    return `${value}`;
};

const renderFieldType = (value?: JsonData) => {
    if (!isJsonData(value)) {
        return 'invalid';
    } else if (value instanceof Array) {
        return 'array';
    }
    return typeof value;
};

export const App: React.FC = () => {
    const [textData, setTextData] = useState(initialTextData);

    const jsonData = useMemo(() => {
        try {
            return JSON.parse(textData);
        } catch (_error) {
            return undefined;
        }
    }, [textData]);

    const [lastTreeNodeEvent, setLastTreeNodeEvent] = useState({
        path: treeRootPath,
        value: jsonData,
    } as TreeNodeEvent);

    const handleTextDataChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(event.target.value);
    }, []);

    const handleTreeViewNodeClick = useCallback((event: TreeNodeEvent) => {
        setLastTreeNodeEvent(event);
    }, []);

    useEffect(() => {
        setLastTreeNodeEvent({
            path: treeRootPath,
            value: jsonData,
        });
    }, [jsonData]);

    return (
        <div className='app'>
            <div className='appLeft'>
                <FieldDescription label='Field Path'>{lastTreeNodeEvent.path}</FieldDescription>
                <FieldDescription label='Field Value'>{renderFieldValue(lastTreeNodeEvent.value)}</FieldDescription>
                <FieldDescription label='Field Type'>{renderFieldType(lastTreeNodeEvent.value)}</FieldDescription>
                <br />
                <TreeView jsonData={jsonData} onNodeClick={handleTreeViewNodeClick} />
            </div>
            <div className='appRight'>
                <textarea className='appTextDataTextarea' value={textData} onChange={handleTextDataChange} />
            </div>
        </div>
    );
};
