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
    nodePath: string; // for example, .aaa.[0].bbb
    nodeValue: JsonData;
    onClick: (nodePath: string, nodeValue: JsonData) => void;
};

export const TreeNode: React.FC<Props> = ({nodePath, nodeValue, onClick}) => {
    const isArray = nodeValue instanceof Array;

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
                const isKeyDangerous = specialCharacterRegExp.test(key);
                const newNodePathSegment = isArray ? `[${key}]` : `${key}`;
                const newNodePath = `${nodePath}.${newNodePathSegment}`;
                const handleKeyClick = () => onClick(newNodePath, value);
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
};
