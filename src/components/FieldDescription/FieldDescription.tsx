import {memo} from 'react';

import styles from './FieldDescription.styl';

type Props = {
    label: string;
    children?: React.ReactNode;
};

export const FieldDescription: React.FC<Props> = memo(({label, children}) => {
    return (
        <label className={styles.fieldDescription}>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>{children}</div>
        </label>
    );
});
