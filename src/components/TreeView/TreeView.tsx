import './TreeView.styl';
import {useMemo} from 'react';
import {isJsonData} from 'utils/json';
import {JsonData} from 'types/json';
import {TreeNodeEvent} from 'types/tree';
import {TreeNode} from 'components/TreeNode/TreeNode';
import {treeRootPath} from 'constants/tree';
import {noop} from 'utils/common';

type Props = {
    jsonData?: JsonData;
    onNodeClick?: (event: TreeNodeEvent) => void;
};

export const TreeView: React.FC<Props> = ({jsonData, onNodeClick = noop}) => {
    const pathSegments = useMemo(() => {
        return [treeRootPath];
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
