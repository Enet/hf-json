import styles from './FieldDescription.styl';

type Props = {
    label: string;
    children?: React.ReactNode;
};

export const FieldDescription: React.FC<Props> = ({label, children}) => {
    return (
        <div className={styles.fieldDescription}>
            <label className={styles.label}>{label}</label>
            <div className={styles.value}>{children}</div>
        </div>
    );
};
