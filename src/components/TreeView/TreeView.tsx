import './TreeView.styl';
import {useMemo} from 'react';
import {isJsonData} from 'utils/json';
import {JsonData} from 'types/json';
import {TreeNode} from 'components/TreeNode/TreeNode';
import {noop} from 'utils/common';

type Props = {
    jsonData?: JsonData;
    onNodeClick?: (pathSegments: string[], value: JsonData) => void;
};

export const TreeView: React.FC<Props> = ({jsonData, onNodeClick = noop}) => {
    const pathSegments = useMemo(() => {
        return [];
    }, [jsonData]);

    return (
        <div className='treeView'>
            {isJsonData(jsonData) ? (
                <TreeNode jsonData={jsonData} pathSegments={pathSegments} onClick={onNodeClick} />
            ) : (
                <div className='treeViewPlaceholder'>No data</div>
            )}
        </div>
    );
};
