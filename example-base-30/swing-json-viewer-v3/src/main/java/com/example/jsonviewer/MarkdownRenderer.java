package com.example.jsonviewer;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.ext.gfm.strikethrough.StrikethroughExtension;

import javax.swing.*;
import java.awt.*;
import java.util.List;

public final class MarkdownRenderer {
    private MarkdownRenderer() {}

    public static JEditorPane createPane() {
        JEditorPane pane = new JEditorPane();
        pane.setContentType("text/html");
        pane.setEditable(false);
        pane.setBackground(Color.WHITE);
        pane.putClientProperty(JEditorPane.HONOR_DISPLAY_PROPERTIES, Boolean.TRUE);
        pane.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        return pane;
    }

    public static void render(JEditorPane pane, String markdown) {
        Parser parser = Parser.builder()
                .extensions(List.of(TablesExtension.create(), StrikethroughExtension.create()))
                .build();
        HtmlRenderer renderer = HtmlRenderer.builder()
                .extensions(List.of(TablesExtension.create(), StrikethroughExtension.create()))
                .build();
        Node document = parser.parse(markdown == null ? "" : markdown);
        String html = renderer.render(document);
        pane.setText("<html><head><style>" + css() + "</style></head><body>" + html + "</body></html>");
        pane.setCaretPosition(0);
    }

    private static String css() {
        return "body{font-family:'Segoe UI';font-size:14px;color:#202124;margin:18px;}" +
                "h1{font-size:25px;color:#1f2937;border-bottom:1px solid #ddd;padding-bottom:7px;}" +
                "h2{font-size:21px;color:#374151;margin-top:20px;}" +
                "h3{font-size:17px;color:#4b5563;}" +
                "p{line-height:1.55;}li{margin:5px 0;}" +
                "strong{color:#111827;}" +
                "code{font-family:'Consolas';background:#f1f3f4;padding:2px 4px;}" +
                "pre{background:#f6f8fa;border:1px solid #e1e4e8;padding:12px;font-family:'Consolas';font-size:12px;}" +
                "table{border-collapse:collapse;margin:12px 0;}th{background:#eef2ff;font-weight:bold;}th,td{border:1px solid #cbd5e1;padding:7px 10px;}" +
                "blockquote{border-left:4px solid #94a3b8;padding-left:12px;color:#475569;}";
    }
}
