import cn from 'classnames';
import {memo, useCallback, useMemo, useState} from 'react';

import {JsonData, JsonValue} from 'types/json';
import {escapeKey} from 'utils/common';
import {isJsonData, isJsonValue} from 'utils/json';

import styles from './TreeNode.styl';

const renderJsonValue = (value: JsonValue) => {
    return typeof value === 'string' ? `"${value.replace(/"/g, '\\"')}"` : `${value}`;
};

type Props = {
    nodePath: string; // for example, .aaaa.[0].bb\.bb
    nodeValue: JsonData;
    onClick: (nodePath: string, nodeValue: JsonData) => void;
};

export const TreeNode: React.FC<Props> = memo(({nodePath, nodeValue, onClick}) => {
    const isArray = Array.isArray(nodeValue);

    const entries = useMemo(() => {
        return Object.entries(nodeValue || {});
    }, [nodeValue]);

    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        onClick(nodePath, nodeValue);
    }, [nodePath, nodeValue, onClick]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    if (isJsonValue(nodeValue)) {
        return (
            <span className={cn(styles.treeNode, styles.isLeaf)} onClick={handleClick}>
                {renderJsonValue(nodeValue)}
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
                const escapedKey = escapeKey(key);
                const newNodePathKey = isArray ? `[${escapedKey}]` : `${escapedKey}`;
                const newNodePath = `${nodePath}.${newNodePathKey}`;
                const handleKeyClick = () => onClick(newNodePath, value);
                return (
                    <div key={key} className={styles.body}>
                        {!isArray && (
                            <>
                                <span className={styles.key} onClick={handleKeyClick}>
                                    {renderJsonValue(key)}
                                </span>
                                <span>: </span>
                            </>
                        )}
                        <TreeNode nodePath={newNodePath} nodeValue={value} onClick={onClick} />
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
            {nodePath.length > 0 && ','}
            <br />
        </span>
    );
});
