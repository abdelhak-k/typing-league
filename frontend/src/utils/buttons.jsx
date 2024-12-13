import React from 'react';
import CustomIconButton from "./iconButton/CustomIconButton";
import { faRotateLeft, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export const ResetButton = ({ onClick }) => (
    <CustomIconButton icon={faRotateLeft} onClick={onClick} />
);

export const PlayButton = ({ onClick }) => (
    <CustomIconButton icon={faPlay} onClick={onClick} />
);

export const PauseButton = ({ onClick }) => (
    <CustomIconButton icon={faPause} onClick={onClick} />
);
