import {useMemo} from 'react';

import {TreeNode} from 'components/TreeNode/TreeNode';
import {JsonData} from 'types/json';
import {noop} from 'utils/common';
import {isJsonData} from 'utils/json';

import styles from './TreeView.styl';

type Props = {
    jsonData?: JsonData;
    onNodeClick?: (pathSegments: string[], value: JsonData) => void;
};

export const TreeView: React.FC<Props> = ({jsonData, onNodeClick = noop}) => {
    const pathSegments = useMemo(() => {
        return [];
    }, [jsonData]);

    return (
        <div className={styles.treeView}>
            {isJsonData(jsonData) ? (
                <TreeNode jsonData={jsonData} pathSegments={pathSegments} onClick={onNodeClick} />
            ) : (
                <div className={styles.placeholder}>Invalid JSON can not be parsed</div>
            )}
        </div>
    );
};
