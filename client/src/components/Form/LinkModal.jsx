import React from "react";
import styles from './form.module.css';
import * as Icons from "./Icons";
import { Modal } from "./Modal";

export function LinkModal(props) {
    const {
        url,
        closeModal,
        onChangeUrl,
        onSaveLink,
        onRemoveLink,
        ...rest
    } = props;
    return (
        <Modal {...rest}>
            <h2 className={styles.modalTitle}>Edit link</h2>
            <button className={styles.modalClose} type="button" onClick={closeModal}>
                <Icons.X />
            </button>
            <input
                className={styles.modalInput}
                autoFocus
                value={url}
                onChange={onChangeUrl}
            />
            <div className={styles.modalButtons}>
                <button className={styles.buttonRemove} type="button" onClick={onRemoveLink}>
                    Remove
                </button>
                <button className={styles.buttonSave} type="button" onClick={onSaveLink}>
                    Save
                </button>
            </div>
        </Modal>
    );
}
