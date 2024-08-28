import './App.styl';

import {FieldDescription} from 'components/FieldDescription/FieldDescription';
import {TreeView} from 'components/TreeView/TreeView';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {JsonData} from 'types/json';
import {isJsonData, isJsonValue} from 'utils/json';

const initialJsonData = {
    date: '2021-10-27T07:49:14.896Z',
    hasError: false,
    fields: [
        {
            id: '4c212130',
            prop: 'iban',
            value: 'DE81200505501265402568',
            hasError: false,
        },
    ],
};

const initialTextData = JSON.stringify(initialJsonData, null, 4);

const findFieldValue = (mutableReversedPathSegments: string[], jsonData?: unknown): JsonData | undefined => {
    if (!isJsonData(jsonData)) {
        return;
    } else if (mutableReversedPathSegments.length) {
        const key = mutableReversedPathSegments.pop();
        if (isJsonValue(jsonData) || key === undefined || !(key in jsonData)) {
            return;
        }
        return findFieldValue(
            mutableReversedPathSegments,
            jsonData instanceof Array ? jsonData[Number(key)] : jsonData[key],
        );
    }
    return jsonData;
};

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

    const jsonData: JsonData | undefined = useMemo(() => {
        try {
            return JSON.parse(textData);
        } catch (_error) {
            return undefined;
        }
    }, [textData]);

    const [fieldPath, setFieldPath] = useState('');

    const [fieldValue, setFieldValue] = useState(jsonData);

    const handleTextDataChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(event.target.value);
    }, []);

    const handleTreeViewNodeClick = useCallback((pathSegments: string[], value: JsonData) => {
        setFieldPath(pathSegments.join('.').replace(/\.\[(\d+)\]/g, '[$1]'));
        setFieldValue(value);
    }, []);

    const handleFieldPathInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setFieldPath(event.target.value);
            const mutableReversedPathSegments = event.target.value
                .replace(/\[(\d+)\]/g, '.$1')
                .split('.')
                .reverse();
            if (!event.target.value) {
                mutableReversedPathSegments.pop();
            }
            setFieldValue(findFieldValue(mutableReversedPathSegments, jsonData));
        },
        [jsonData],
    );

    useEffect(() => {
        setFieldPath('');
        setFieldValue(jsonData);
    }, [jsonData]);

    return (
        <div className='app'>
            <div className='appLeft'>
                <FieldDescription label='Field Path'>
                    <input className='appFieldPathInput' value={fieldPath} onChange={handleFieldPathInputChange} />
                </FieldDescription>
                <FieldDescription label='Field Value'>{renderFieldValue(fieldValue)}</FieldDescription>
                <FieldDescription label='Field Type'>{renderFieldType(fieldValue)}</FieldDescription>
                <br />
                <TreeView jsonData={jsonData} onNodeClick={handleTreeViewNodeClick} />
            </div>
            <div className='appRight'>
                <textarea className='appTextDataTextarea' value={textData} onChange={handleTextDataChange} />
            </div>
        </div>
    );
};
