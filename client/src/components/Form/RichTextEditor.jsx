import styles from './form.module.css';
import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
// => Tiptap packages
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
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
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";




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
            ListItem,
            BulletList,
            OrderedList,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
        ],
        content: content || '',
        editable: true,
    });
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    // useEffect(() => {
    //     if (!editor || !content) return;

    //     if (editor.getHTML() !== content) {
    //         console.log(editor.getHTML());
    //         console.log(content);

    //         editor.commands.setContent(content);
    //     }
    // }, [editor, content]);

    useEffect(() => {
        if (editor && content) {
            // Set content on first mount or when content prop changes
            editor.commands.setContent(content);
        }

        if (editor) {
            // Update content in real-time based on editor changes
            editor.on('update', () => {
                setContent(editor.getHTML());  // Update the content state whenever editor updates
            });
        }
    }, [editor, content, setContent]);

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

    const toggleBulletList = useCallback(() => {
        editor.chain().focus().toggleList('bulletList', 'listItem').run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        editor.chain().focus().toggleList('orderedList', 'listItem').run();
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
                        [styles.isActive]: editor.isActive("link")
                    })}
                    onClick={openModal}
                >
                    <Icons.Link />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("bold")
                    })}
                    onClick={toggleBold}
                >
                    <Icons.Bold />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("underline")
                    })}
                    onClick={toggleUnderline}
                >
                    <Icons.Underline />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("italic")
                    })}
                    onClick={toggleItalic}
                >
                    <Icons.Italic />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("strike")
                    })}
                    onClick={toggleStrike}
                >
                    <Icons.Strikethrough />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("code")
                    })}
                    onClick={toggleCode}
                >
                    <Icons.Code />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("bulletList")
                    })}
                    onClick={toggleBulletList}
                >
                    <Icons.BulletList />
                </button>
                <button
                    type="button"
                    className={classNames(styles.menuButton, {
                        [styles.isActive]: editor.isActive("orderedList")
                    })}
                    onClick={toggleOrderedList}
                >
                    <Icons.OrderedList />
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
