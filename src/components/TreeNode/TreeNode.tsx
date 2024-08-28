import './TreeNode.styl';
import {useCallback, useMemo, useState} from 'react';
import {isJsonData, isJsonValue} from 'utils/json';
import {JsonData, JsonValue} from 'types/json';
import {TreeNodeEvent} from 'types/tree';

const commaCharacter = ',';

const renderJsonValue = (value: JsonValue) => {
    return typeof value === 'string' ? `"${value}"` : `${value}`;
};

type Props = {
    jsonData: JsonData;
    pathSegments: string[];
    onClick: (event: TreeNodeEvent) => void;
};

export const TreeNode: React.FC<Props> = ({jsonData, pathSegments, onClick}) => {
    const isArray = jsonData instanceof Array;

    const path = pathSegments.join('');

    const entries = useMemo(() => {
        return Object.entries(jsonData || {});
    }, [jsonData]);

    const [isHovered, setIsHovered] = useState(false);

    const handleClick = useCallback(() => {
        onClick({path, value: jsonData});
    }, [jsonData, path, onClick]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    if (isJsonValue(jsonData)) {
        return (
            <span className='treeNode isLeaf' onClick={handleClick}>
                {renderJsonValue(jsonData)}
            </span>
        );
    }

    return (
        <span className={`treeNode ${isHovered ? 'isHovered' : ''}`}>
            <span
                className='treeNodeHeader'
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
                const newPathSegment = isArray ? `[${key}]` : `.${key}`;
                const handleKeyClick = () => {
                    onClick && onClick({path: `${path}${newPathSegment}`, value});
                };
                return (
                    <div key={key} className='treeNodeBody' style={{paddingLeft: pathSegments.length * 16}}>
                        {!isArray && (
                            <>
                                <span className='treeNodeKey' onClick={handleKeyClick}>
                                    {renderJsonValue(key)}
                                </span>
                                <span>: </span>
                            </>
                        )}
                        <TreeNode jsonData={value} pathSegments={[...pathSegments, newPathSegment]} onClick={onClick} />
                        {isJsonValue(value) && (
                            <>
                                {commaCharacter}
                                <br />
                            </>
                        )}
                    </div>
                );
            })}
            <span
                className='treeNodeFooter'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {isArray ? ']' : '}'}
            </span>
            {pathSegments.length > 1 && commaCharacter}
            <br />
        </span>
    );
};
