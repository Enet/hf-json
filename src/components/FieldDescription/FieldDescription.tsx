import './FieldDescription.styl';

type Props = {
    label: string;
    children?: React.ReactNode;
};

export const FieldDescription: React.FC<Props> = ({label, children}) => {
    return (
        <div className='fieldDescription'>
            <label className='fieldDescriptionLabel'>{label}</label>
            <div className='fieldDescriptionValue'>{children}</div>
        </div>
    );
};
