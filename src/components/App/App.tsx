import {useCallback, useEffect, useMemo, useState} from 'react';

import {FieldDescription} from 'components/FieldDescription/FieldDescription';
import {TreeView} from 'components/TreeView/TreeView';
import {JsonData} from 'types/json';
import {isJsonData, isJsonValue} from 'utils/json';

import styles from './App.styl';

type ActiveField = {
    fieldPath: string; // for example, aaa[0].bbb
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

const getMutableReversedFieldPathSegments = (fieldPath: string) => {
    const mutableReversedFieldPathSegments = fieldPath
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .reverse();
    if (!fieldPath) {
        mutableReversedFieldPathSegments.pop();
    }
    return mutableReversedFieldPathSegments;
};

const findFieldValue = (mutableReversedFieldPathSegments: string[], jsonData?: unknown): JsonData | undefined => {
    if (!isJsonData(jsonData)) {
        return;
    } else if (mutableReversedFieldPathSegments.length) {
        const key = mutableReversedFieldPathSegments.pop();
        if (isJsonValue(jsonData) || key === undefined || !(key in jsonData)) {
            return;
        }
        return findFieldValue(
            mutableReversedFieldPathSegments,
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
            const fieldValue = findFieldValue(getMutableReversedFieldPathSegments(fieldPath), jsonData);
            setActiveField({fieldPath, fieldValue});
        },
        [jsonData],
    );

    useEffect(() => {
        const {fieldPath} = activeField;
        const fieldValue = findFieldValue(getMutableReversedFieldPathSegments(fieldPath), jsonData);
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
