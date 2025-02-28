import React from 'react';

interface KeyShapeProps {
    keyType: string;
    id?: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    fill: string;
    stroke: string;
    width: number;
    height: number;
    x: number;
    y: number;
    dataLedIndex: number;
    dataKeyIndex: number;
    dataLayer: number;
    centerPrimary: boolean;
    centerExtra: boolean;
    selectedKey: any;
    keyCode: number;
    className: string;
    strokeWidth: number;
    contrastText: string;
}

const Key: React.FC<KeyShapeProps> = ({
    keyType,
    id,
    onClick,
    fill,
    stroke,
    width,
    height,
    x,
    y,
    dataLedIndex,
    dataKeyIndex,
    dataLayer,
    centerPrimary,
    centerExtra,
    selectedKey,
    keyCode,
}) => {
    return (
        <div
            id={id}
            onClick={onClick}
            style={{
                backgroundColor: fill,
                border: `1px solid ${stroke}`,
                width: `${width}px`,
                height: `${height}px`,
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
            }}
            data-led-index={dataLedIndex}
            data-key-index={dataKeyIndex}
            data-layer={dataLayer}
            className={`key ${centerPrimary ? 'center-primary' : ''} ${centerExtra ? 'center-extra' : ''
                } ${selectedKey === keyCode ? 'selected' : ''}`}
        >
            {/* Render key content here */}
        </div>
    );
};

export default Key;
