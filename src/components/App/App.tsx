import {useCallback, useEffect, useMemo, useState} from 'react';

import {FieldDescription} from 'components/FieldDescription/FieldDescription';
import {TreeView} from 'components/TreeView/TreeView';
import {JsonData} from 'types/json';
import {isJsonData, isJsonValue} from 'utils/json';

import styles from './App.styl';

type ActiveField = {
    path: string;
    value?: JsonData;
};

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

const getMutableReversedPathSegments = (path: string) => {
    const mutableReversedPathSegments = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .reverse();
    if (!path) {
        mutableReversedPathSegments.pop();
    }
    return mutableReversedPathSegments;
};

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

    const [activeField, setActiveField] = useState({
        path: '',
        value: jsonData,
    } as ActiveField);

    const handleTextDataTextareaChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(event.target.value);
    }, []);

    const handleTreeViewNodeClick = useCallback((pathSegments: string[], value: JsonData) => {
        const path = pathSegments.join('.').replace(/\.\[(\d+)\]/g, '[$1]');
        setActiveField({path, value});
    }, []);

    const handleFieldPathInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const path = event.target.value;
            const mutableReversedPathSegments = getMutableReversedPathSegments(path);
            const value = findFieldValue(mutableReversedPathSegments, jsonData);
            setActiveField({path, value});
        },
        [jsonData],
    );

    useEffect(() => {
        const {path} = activeField;
        const mutableReversedPathSegments = getMutableReversedPathSegments(path);
        const value = findFieldValue(mutableReversedPathSegments, jsonData);
        if (isJsonData(value)) {
            setActiveField({path, value});
        } else {
            setActiveField({path: '', value: jsonData});
        }
    }, [jsonData]);

    return (
        <div className={styles.app}>
            <div className={styles.left}>
                <FieldDescription label='Field Path'>
                    <input
                        className={styles.fieldPathInput}
                        value={activeField.path}
                        onChange={handleFieldPathInputChange}
                    />
                </FieldDescription>
                <FieldDescription label='Field Value'>{renderFieldValue(activeField.value)}</FieldDescription>
                <FieldDescription label='Field Type'>{renderFieldType(activeField.value)}</FieldDescription>
                <br />
                <TreeView jsonData={jsonData} onNodeClick={handleTreeViewNodeClick} />
            </div>
            <div className={styles.right}>
                <textarea
                    className={styles.textDataTextarea}
                    value={textData}
                    onChange={handleTextDataTextareaChange}
                />
            </div>
        </div>
    );
};
