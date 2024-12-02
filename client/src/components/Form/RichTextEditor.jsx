import styles from './form.module.css';
import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
// => Tiptap packages
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import { Placeholder } from '@tiptap/extension-placeholder';

import * as Icons from "./Icons";
import { LinkModal } from "./LinkModal";

export default function RichTextEditor({ content, setContent }) {
    const editor = useEditor({
        extensions: [
            Document,
            History,
            Paragraph,
            Text,
            Link.configure({
                openOnClick: false
            }),
            Bold,
            Underline,
            Italic,
            Strike,
            Code,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
        ],
        content: content || '',
        editable: true,
    });
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!editor || !content) return;

        if (editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    const openModal = useCallback(() => {
        console.log(editor.chain().focus());
        setUrl(editor.getAttributes("link").href);
        setIsOpen(true);
    }, [editor]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setUrl("");
    }, []);

    const saveLink = useCallback(() => {
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url, target: "_blank" })
                .run();
        } else {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }
        closeModal();
    }, [editor, url, closeModal]);

    const removeLink = useCallback(() => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        closeModal();
    }, [editor, closeModal]);

    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleUnderline = useCallback(() => {
        editor.chain().focus().toggleUnderline().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const toggleCode = useCallback(() => {
        editor.chain().focus().toggleCode().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={classNames(styles.editor, 'text-black')}>
            <div className={styles.menu}>
                <button
                    type="button"
                    className={styles.menuButton}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Icons.RotateLeft />
                </button>
                <button
                    type="button"
                    className={styles.menuButton}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Icons.RotateRight />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("link")
                    })}
                    onClick={openModal}
                >
                    <Icons.Link />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("bold")
                    })}
                    onClick={toggleBold}
                >
                    <Icons.Bold />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("underline")
                    })}
                    onClick={toggleUnderline}
                >
                    <Icons.Underline />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("italic")
                    })}
                    onClick={toggleItalic}
                >
                    <Icons.Italic />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("strike")
                    })}
                    onClick={toggleStrike}
                >
                    <Icons.Strikethrough />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        "is-active": editor.isActive("code")
                    })}
                    onClick={toggleCode}
                >
                    <Icons.Code />
                </button>
            </div>

            <BubbleMenu
                className={styles.bubbleMenuLight}
                tippyOptions={{ duration: 150 }}
                editor={editor}
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                    // only show the bubble menu for links.
                    return from === to && editor.isActive("link");
                }}
            >
                <button type="button" className={styles.button} onClick={openModal}>
                    Edit
                </button>
                <button type="button" className={styles.buttonRemove} onClick={removeLink}>
                    Remove
                </button>
            </BubbleMenu>

            <LinkModal
                url={url}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Link Modal"
                closeModal={closeModal}
                onChangeUrl={(e) => setUrl(e.target.value)}
                onSaveLink={saveLink}
                onRemoveLink={removeLink}
            />

            <EditorContent editor={editor} className={styles.ProseMirror} />

        </div>
    );
}
