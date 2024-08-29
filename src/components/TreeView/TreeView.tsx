import {TreeNode} from 'components/TreeNode/TreeNode';
import {JsonData} from 'types/json';
import {noop} from 'utils/common';
import {isJsonData} from 'utils/json';

import styles from './TreeView.styl';

type Props = {
    jsonData?: JsonData;
    onNodeClick?: (nodePath: string, nodeValue: JsonData) => void;
};

export const TreeView: React.FC<Props> = ({jsonData, onNodeClick = noop}) => {
    return (
        <div className={styles.treeView}>
            {isJsonData(jsonData) ? (
                <TreeNode nodePath='' nodeValue={jsonData} onClick={onNodeClick} />
            ) : (
                <div className={styles.placeholder}>Invalid JSON can not be parsed</div>
            )}
        </div>
    );
};
