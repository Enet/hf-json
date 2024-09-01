import {useCallback, useEffect, useMemo, useState} from 'react';

import {FieldDescription} from 'components/FieldDescription/FieldDescription';
import {TreeView} from 'components/TreeView/TreeView';
import {JsonData} from 'types/json';
import {unescapeKey} from 'utils/common';
import {isJsonData, isJsonValue} from 'utils/json';

import styles from './App.styl';

type ActiveField = {
    fieldPath: string; // for example, aaaa[0].bb\.bb
    fieldValue?: JsonData;
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

const getFieldPathKeys = (fieldPath: string) => {
    const unifiedFieldPath = fieldPath.replace(/\[(\d+)\]/g, '.$1');
    const fieldPathKeys: string[] = [];
    let keyStartIndex = 0;
    let isCharacterEscaped = false;
    for (let u = 0, ul = unifiedFieldPath.length; u < ul; u++) {
        const character = unifiedFieldPath[u];
        if (isCharacterEscaped) {
            isCharacterEscaped = false;
            continue;
        } else if (character === '\\') {
            isCharacterEscaped = true;
            continue;
        } else if (character === '.') {
            const escapedKey = unifiedFieldPath.slice(keyStartIndex, u);
            fieldPathKeys.push(unescapeKey(escapedKey));
            keyStartIndex = u + 1;
        }
    }
    if (fieldPath) {
        fieldPathKeys.push(unescapeKey(unifiedFieldPath.slice(keyStartIndex)));
    }
    return fieldPathKeys;
};

const findFieldValue = (fieldPathKeys: string[], jsonData?: unknown): JsonData | undefined => {
    let currentData = jsonData;
    for (let f = 0, fl = fieldPathKeys.length; f < fl; f++) {
        const key = fieldPathKeys[f];
        if (!isJsonData(currentData) || isJsonValue(currentData) || !currentData.hasOwnProperty(key)) {
            return;
        }
        currentData = Array.isArray(currentData) ? currentData[Number(key)] : currentData[key];
    }
    return isJsonData(currentData) ? currentData : undefined;
};

const renderFieldValue = (value?: JsonData) => {
    if (!isJsonData(value)) {
        return '';
    } else if (!isJsonValue(value)) {
        return Array.isArray(value) ? '[...]' : '{...}';
    }
    return `${value}`;
};

const renderFieldType = (value?: JsonData) => {
    if (!isJsonData(value)) {
        return 'invalid';
    } else if (Array.isArray(value)) {
        return 'array';
    } else if (value === null) {
        return 'null';
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
        fieldPath: '',
        fieldValue: jsonData,
    } as ActiveField);

    const handleTextDataTextareaChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextData(event.target.value);
    }, []);

    const handleTreeViewNodeClick = useCallback((nodePath: string, nodeValue: JsonData) => {
        const fieldPath = nodePath.replace(/\.\[(\d+)\]/g, '[$1]').replace(/^\./, '');
        setActiveField({fieldPath, fieldValue: nodeValue});
    }, []);

    const handleFieldPathInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const fieldPath = event.target.value;
            const fieldValue = findFieldValue(getFieldPathKeys(fieldPath), jsonData);
            setActiveField({fieldPath, fieldValue});
        },
        [jsonData],
    );

    useEffect(() => {
        const {fieldPath} = activeField;
        const fieldValue = findFieldValue(getFieldPathKeys(fieldPath), jsonData);
        if (isJsonData(fieldValue)) {
            setActiveField({fieldPath, fieldValue});
        } else if (isJsonData(jsonData)) {
            setActiveField({fieldPath: '', fieldValue: jsonData});
        }
    }, [jsonData]);

    const fieldValue = isJsonData(jsonData) ? activeField.fieldValue : undefined;

    return (
        <div className={styles.app}>
            <div className={styles.left}>
                <FieldDescription label='Field Path'>
                    <input
                        className={styles.fieldPathInput}
                        value={activeField.fieldPath}
                        onChange={handleFieldPathInputChange}
                    />
                </FieldDescription>
                <FieldDescription label='Field Value'>{renderFieldValue(fieldValue)}</FieldDescription>
                <FieldDescription label='Field Type'>{renderFieldType(fieldValue)}</FieldDescription>
                <br className={styles.lineBreak} />
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
