import cn from 'classnames';
import {useCallback, useMemo, useState} from 'react';

import {JsonData, JsonValue} from 'types/json';
import {isJsonData, isJsonValue} from 'utils/json';

import styles from './TreeNode.styl';

const specialCharacterRegExp = /[.\[\]]/;

const renderJsonValue = (value: JsonValue) => {
    return typeof value === 'string' ? `"${value}"` : `${value}`;
};

type Props = {
    jsonData: JsonData;
    pathSegments: string[];
    onClick: (pathSegments: string[], value: JsonData) => void;
};

export const TreeNode: React.FC<Props> = ({jsonData, pathSegments, onClick}) => {
    const isArray = jsonData instanceof Array;

    const entries = useMemo(() => {
        return Object.entries(jsonData || {});
    }, [jsonData]);

    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        onClick(pathSegments, jsonData);
    }, [jsonData, pathSegments, onClick]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    if (isJsonValue(jsonData)) {
        return (
            <span className={cn(styles.treeNode, styles.isLeaf)} onClick={handleClick}>
                {renderJsonValue(jsonData)}
            </span>
        );
    }

    return (
        <span className={cn(styles.treeNode, isHovered && styles.isHovered)}>
            <span
                className={styles.header}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {isArray ? '[' : '{'}
            </span>
            {entries.length > 1 && <br />}
            {entries.map(([key, value]) => {
                if (!isJsonData(value)) {
                    return null;
                }
                const isKeyDangerous = specialCharacterRegExp.test(key);
                const newPathSegments = [...pathSegments, isArray ? `[${key}]` : `${key}`];
                const handleKeyClick = () => onClick(newPathSegments, value);
                return (
                    <div key={key} className={styles.body}>
                        {!isArray && (
                            <>
                                <span
                                    className={cn(styles.key, isKeyDangerous && styles.isDangerous)}
                                    title={isKeyDangerous ? 'This key breaks navigation in JSON Explorer' : undefined}
                                    onClick={handleKeyClick}
                                >
                                    {renderJsonValue(key)}
                                </span>
                                <span>: </span>
                            </>
                        )}
                        <TreeNode jsonData={value} pathSegments={newPathSegments} onClick={onClick} />
                        {isJsonValue(value) && (
                            <>
                                {','}
                                <br />
                            </>
                        )}
                    </div>
                );
            })}
            <span
                className={styles.footer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {isArray ? ']' : '}'}
            </span>
            {pathSegments.length > 0 && ','}
            <br />
        </span>
    );
};
