package com.example.jarttoexe;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.BorderLayout;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

public class Main {
    private final JFrame frame = new JFrame("JAR → EXE Packaging Studio V3");

    private final JTextField jar = new JTextField();
    private final JTextField app = new JTextField("My Java Application");
    private final JTextField version = new JTextField("1.0.0");
    private final JTextField main = new JTextField();
    private final JTextField icon = new JTextField();
    private final JTextField output = new JTextField();
    private final JTextField install = new JTextField();
    private final JTextField runtime = new JTextField();
    private final JTextField profile = new JTextField("default");

    private final JComboBox<String> type = new JComboBox<>(
            new String[]{"Windows Installer (.exe)", "Portable App Image"});
    private final JCheckBox menu = new JCheckBox("Start Menu", true);
    private final JCheckBox desktop = new JCheckBox("Desktop", true);
    private final JCheckBox perUser = new JCheckBox("Per-user", false);

    private final DefaultListModel<String> jvmModel = new DefaultListModel<>();
    private final JList<String> jvmList = new JList<>(jvmModel);
    private final DefaultListModel<String> resourceModel = new DefaultListModel<>();
    private final JList<String> resourceList = new JList<>(resourceModel);
    private final DefaultListModel<String> envModel = new DefaultListModel<>();
    private final JList<String> envList = new JList<>(envModel);

    private final JTextArea command = new JTextArea();
    private final JTextArea log = new JTextArea();
    private JButton build;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new Main().show());
    }

    private void show() {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setMinimumSize(new Dimension(1100, 780));
        frame.setSize(1200, 900);
        frame.setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout(8, 8));
        root.setBorder(new EmptyBorder(10, 10, 10, 10));

        root.add(top(), BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("Packaging", packagingTab());
        tabs.addTab("JVM Options", listTab(jvmList, "JVM arguments", () -> addText(jvmModel, "JVM option")));
        tabs.addTab("Resources", listTab(resourceList, "Resources to package", () -> addResource()));
        tabs.addTab("Environment", listTab(envList, "Environment variables (KEY=VALUE)", () -> addText(envModel, "KEY=VALUE")));
        tabs.addTab("Command", commandTab());

        root.add(tabs, BorderLayout.CENTER);
        root.add(bottom(), BorderLayout.SOUTH);

        frame.setContentPane(root);
        wire();
        refreshCommand();
        frame.setVisible(true);
    }

    private JPanel top() {
        JPanel p = new JPanel(new BorderLayout());
        JLabel title = new JLabel("JAR → EXE Packaging Studio");
        title.setFont(title.getFont().deriveFont(Font.BOLD, 22f));
        p.add(title, BorderLayout.WEST);

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        right.add(new JLabel("Profile:"));
        right.add(profile);
        right.add(button("Load", e -> loadProfile()));
        right.add(button("Save", e -> saveProfile()));
        right.add(button("New", e -> clearProfile()));
        p.add(right, BorderLayout.EAST);
        return p;
    }

    private JPanel packagingTab() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBorder(new EmptyBorder(8, 8, 8, 8));
        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(5, 5, 5, 5);
        g.fill = GridBagConstraints.HORIZONTAL;

        int y = 0;
        row(p,g,y++,"JAR file",jar,browse(jar,false,"jar"));
        row(p,g,y++,"Application",app,blank());
        row(p,g,y++,"Version",version,blank());
        row(p,g,y++,"Main class",main,button("Detect",e -> detectMain()));
        row(p,g,y++,"Icon (.ico)",icon,browse(icon,false,"ico"));
        row(p,g,y++,"Output folder",output,browse(output,true,""));
        row(p,g,y++,"Install directory",install,blank());
        row(p,g,y++,"Runtime/JRE path",runtime,browse(runtime,true,""));

        g.gridx=0;g.gridy=y;g.weightx=0;p.add(new JLabel("Package type"),g);
        g.gridx=1;g.weightx=1;p.add(type,g);
        g.gridx=2;g.weightx=0;p.add(blank(),g); y++;

        JPanel opts=new JPanel(new FlowLayout(FlowLayout.LEFT));
        opts.add(menu);opts.add(desktop);opts.add(perUser);
        g.gridx=0;g.gridy=y;g.gridwidth=3;p.add(opts,g); y++;

        JPanel checks=new JPanel(new FlowLayout(FlowLayout.LEFT));
        checks.add(button("Check Prerequisites",e->checkPrerequisites()));
        checks.add(button("Open Output",e->openOutput()));
        g.gridx=0;g.gridy=y;g.gridwidth=3;p.add(checks,g);

        return p;
    }

    private JPanel listTab(JList<String> list, String title, Runnable addAction) {
        JPanel p=new JPanel(new BorderLayout(8,8));
        p.setBorder(BorderFactory.createTitledBorder(title));
        JPanel buttons=new JPanel(new FlowLayout(FlowLayout.LEFT));
        buttons.add(button("Add",e->addAction.run()));
        buttons.add(button("Edit",e->editSelected(list)));
        buttons.add(button("Remove",e->removeSelected(list)));
        buttons.add(button("Clear",e->((DefaultListModel<String>)list.getModel()).clear()));
        p.add(buttons,BorderLayout.NORTH);
        p.add(new JScrollPane(list),BorderLayout.CENTER);
        return p;
    }

    private JPanel commandTab() {
        JPanel p=new JPanel(new BorderLayout());
        command.setEditable(false);
        command.setLineWrap(true);
        command.setWrapStyleWord(true);
        command.setFont(new Font(Font.MONOSPACED,Font.PLAIN,13));
        p.add(new JScrollPane(command),BorderLayout.CENTER);
        JPanel b=new JPanel(new FlowLayout(FlowLayout.RIGHT));
        b.add(button("Copy Command",e->copyCommand()));
        p.add(b,BorderLayout.SOUTH);
        return p;
    }

    private JPanel bottom() {
        JPanel p=new JPanel(new BorderLayout(8,8));
        p.setBorder(BorderFactory.createTitledBorder("Build Log"));
        log.setEditable(false);
        log.setRows(7);
        log.setFont(new Font(Font.MONOSPACED,Font.PLAIN,12));
        p.add(new JScrollPane(log),BorderLayout.CENTER);
        JPanel buttons=new JPanel(new FlowLayout(FlowLayout.RIGHT));
        build=button("🚀 Build Package",e->buildPackage());
        buttons.add(build);
        buttons.add(button("Build + Launch",e->buildPackage(true)));
        p.add(buttons,BorderLayout.SOUTH);
        return p;
    }

    private void wire() {
        type.addActionListener(e -> {
            boolean exe=type.getSelectedIndex()==0;
            menu.setEnabled(exe); desktop.setEnabled(exe); perUser.setEnabled(exe);
            refreshCommand();
        });
        DocumentListenerAdapter listener=new DocumentListenerAdapter(this::refreshCommand);
        for(JTextField f:List.of(jar,app,version,main,icon,output,install,runtime))
            f.getDocument().addDocumentListener(listener);
    }

    private void detectMain() {
        try(JarFile jf=new JarFile(jar.getText().trim())) {
            Manifest mf=jf.getManifest();
            String m=mf==null?null:mf.getMainAttributes().getValue("Main-Class");
            if(m==null||m.isBlank()) {
                info("Main-Class not found in JAR manifest.");
                return;
            }
            main.setText(m.replace('/','.'));
            append("Detected Main-Class: "+main.getText());
        } catch(Exception e) { error("Unable to read JAR",e); }
    }

    private List<String> commandList() {
        List<String> c=new ArrayList<>();
        Path jp=Path.of(jar.getText().trim());
        c.add("jpackage");
        c.add("--type"); c.add(type.getSelectedIndex()==0?"exe":"app-image");
        c.add("--name"); c.add(app.getText().trim());
        c.add("--app-version"); c.add(version.getText().trim());
        c.add("--input"); c.add(jp.getParent()==null?".":jp.getParent().toString());
        c.add("--main-jar"); c.add(jp.getFileName().toString());
        c.add("--main-class"); c.add(main.getText().trim());
        c.add("--dest"); c.add(output.getText().trim());

        if(!icon.getText().isBlank()) { c.add("--icon"); c.add(icon.getText().trim()); }
        if(!runtime.getText().isBlank()) { c.add("--runtime-image"); c.add(runtime.getText().trim()); }

        if(type.getSelectedIndex()==0) {
            if(menu.isSelected()) c.add("--win-menu");
            if(desktop.isSelected()) c.add("--win-shortcut");
            if(perUser.isSelected()) c.add("--win-per-user-install");
            if(!install.getText().isBlank()) { c.add("--install-dir"); c.add(install.getText().trim()); }
        }

        for(int i=0;i<jvmModel.size();i++) {
            c.add("--java-options"); c.add(jvmModel.get(i));
        }

        return c;
    }

    private void refreshCommand() {
        try { command.setText(ps(commandList())); }
        catch(Exception e) { command.setText("Select a JAR and complete the required fields."); }
    }

    private String ps(List<String> c) {
        StringBuilder b=new StringBuilder();
        for(int i=0;i<c.size();i++) {
            if(i>0)b.append(" ");
            b.append(quote(c.get(i)));
            if(i<c.size()-1)b.append(" `\n");
        }
        return b.toString();
    }

    private String quote(String s) {
        return s.matches("[A-Za-z0-9_./:=+\\-]+")?s:"\""+s.replace("\"","\\\"")+"\"";
    }

    private void buildPackage() { buildPackage(false); }

    private void buildPackage(boolean launch) {
        Path jp=Path.of(jar.getText().trim());
        if(!Files.isRegularFile(jp)) { info("Please select a valid JAR."); return; }
        if(main.getText().isBlank()||app.getText().isBlank()) { info("Application name and Main-Class are required."); return; }
        try {
            Files.createDirectories(Path.of(output.getText().trim()));
        } catch(Exception e) { error("Cannot create output folder",e); return; }

        List<String> c=commandList();
        build.setEnabled(false); log.setText("");
        append("Starting jpackage...");
        append(ps(c));

        new Thread(()->{
            try {
                Process p=new ProcessBuilder(c).redirectErrorStream(true).start();
                try(BufferedReader r=p.inputReader()) {
                    String line; while((line=r.readLine())!=null) {
                        String x=line; SwingUtilities.invokeLater(()->append(x));
                    }
                }
                int code=p.waitFor();
                SwingUtilities.invokeLater(()->{
                    build.setEnabled(true);
                    append(code==0?"✓ BUILD SUCCESSFUL":"✗ BUILD FAILED (exit "+code+")");
                    if(code==0 && launch) launchOutput();
                });
            } catch(Exception e) {
                SwingUtilities.invokeLater(()->{ build.setEnabled(true); error("Build failed",e); });
            }
        },"jpackage-v3").start();
    }

    private void launchOutput() {
        try {
            Path dir=Path.of(output.getText().trim());
            if(type.getSelectedIndex()==1) {
                Path exe=dir.resolve(app.getText().trim()).resolve("bin").resolve(app.getText().trim()+".exe");
                if(Files.exists(exe)) new ProcessBuilder(exe.toString()).start();
                else openOutput();
            } else {
                openOutput();
                info("Installer was created. Open the output folder to run it.");
            }
        } catch(Exception e) { error("Unable to launch package",e); }
    }

    private void saveProfile() {
        JFileChooser c=new JFileChooser();
        c.setSelectedFile(new File(profile.getText().trim()+".json"));
        if(c.showSaveDialog(frame)!=JFileChooser.APPROVE_OPTION)return;
        try {
            Files.writeString(c.getSelectedFile().toPath(), profileJson());
            append("Profile saved: "+c.getSelectedFile());
        } catch(Exception e) { error("Profile save failed",e); }
    }

    private void loadProfile() {
        JFileChooser c=new JFileChooser();
        if(c.showOpenDialog(frame)!=JFileChooser.APPROVE_OPTION)return;
        try {
            String x=Files.readString(c.getSelectedFile().toPath());
            Map<String,String> m=parseSimpleJson(x);
            jar.setText(m.getOrDefault("jar",""));
            app.setText(m.getOrDefault("application","My Java Application"));
            version.setText(m.getOrDefault("version","1.0.0"));
            main.setText(m.getOrDefault("mainClass",""));
            icon.setText(m.getOrDefault("icon",""));
            output.setText(m.getOrDefault("output",""));
            install.setText(m.getOrDefault("installDir",""));
            runtime.setText(m.getOrDefault("runtimeImage",""));
            profile.setText(c.getSelectedFile().getName().replace(".json",""));
            refreshCommand();
            append("Profile loaded: "+c.getSelectedFile());
        } catch(Exception e) { error("Profile load failed",e); }
    }

    private String profileJson() {
        return "{\n"
            +"  \"jar\":\""+esc(jar.getText())+"\",\n"
            +"  \"application\":\""+esc(app.getText())+"\",\n"
            +"  \"version\":\""+esc(version.getText())+"\",\n"
            +"  \"mainClass\":\""+esc(main.getText())+"\",\n"
            +"  \"icon\":\""+esc(icon.getText())+"\",\n"
            +"  \"output\":\""+esc(output.getText())+"\",\n"
            +"  \"installDir\":\""+esc(install.getText())+"\",\n"
            +"  \"runtimeImage\":\""+esc(runtime.getText())+"\"\n"
            +"}\n";
    }

    private Map<String,String> parseSimpleJson(String x) {
        Map<String,String> m=new HashMap<>();
        java.util.regex.Matcher z=java.util.regex.Pattern.compile("\"([^\"]+)\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"").matcher(x);
        while(z.find())m.put(z.group(1),z.group(2).replace("\\\"","\"").replace("\\\\","\\"));
        return m;
    }

    private String esc(String s){return s.replace("\\","\\\\").replace("\"","\\\"");}

    private void clearProfile() {
        jar.setText(""); app.setText("My Java Application"); version.setText("1.0.0");
        main.setText(""); icon.setText(""); output.setText(""); install.setText(""); runtime.setText("");
        jvmModel.clear(); resourceModel.clear(); envModel.clear(); profile.setText("default");
        log.setText(""); refreshCommand();
    }

    private void addText(DefaultListModel<String> model,String title) {
        String s=JOptionPane.showInputDialog(frame,title);
        if(s!=null&&!s.isBlank()) { model.addElement(s.trim()); refreshCommand(); }
    }

    private void addResource() {
        JFileChooser c=new JFileChooser();
        c.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
        if(c.showOpenDialog(frame)==JFileChooser.APPROVE_OPTION) {
            resourceModel.addElement(c.getSelectedFile().getAbsolutePath());
        }
    }

    private void editSelected(JList<String> list) {
        int i=list.getSelectedIndex(); if(i<0)return;
        String s=JOptionPane.showInputDialog(frame,"Edit value",list.getModel().getElementAt(i));
        if(s!=null&&!s.isBlank())((DefaultListModel<String>)list.getModel()).set(i,s.trim());
    }

    private void removeSelected(JList<String> list) {
        int i=list.getSelectedIndex(); if(i>=0)((DefaultListModel<String>)list.getModel()).remove(i);
    }

    private void checkPrerequisites() {
        append("JDK: "+check("java","-version"));
        append("jpackage: "+check("jpackage","--version"));
        append("WiX: "+(check("wix","--version")||(check("candle","-?")&&check("light","-?"))));
    }

    private boolean check(String cmd,String arg) {
        try { Process p=new ProcessBuilder(cmd,arg).redirectErrorStream(true).start(); p.waitFor(); return true; }
        catch(Exception e){return false;}
    }

    private void copyCommand() {
        refreshCommand();
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(command.getText()),null);
        append("Command copied.");
    }

    private void openOutput() {
        try {
            Path p=Path.of(output.getText().trim());
            Files.createDirectories(p);
            if(Desktop.isDesktopSupported())Desktop.getDesktop().open(p.toFile());
        } catch(Exception e){error("Cannot open output folder",e);}
    }

    private JButton browse(JTextField f,boolean dir,String ext) {
        return button("Browse",e->{
            JFileChooser c=new JFileChooser();
            c.setFileSelectionMode(dir?JFileChooser.DIRECTORIES_ONLY:JFileChooser.FILES_ONLY);
            if(c.showOpenDialog(frame)==JFileChooser.APPROVE_OPTION) {
                File x=c.getSelectedFile();
                if(!dir&&!ext.isBlank()&&!x.getName().toLowerCase().endsWith("."+ext)) {
                    info("Please select a ."+ext+" file."); return;
                }
                f.setText(x.getAbsolutePath());
                if(f==jar && output.getText().isBlank())output.setText(x.getParent());
                if(f==jar && app.getText().equals("My Java Application"))app.setText(strip(x.getName()));
                refreshCommand();
            }
        });
    }

    private String strip(String s){int i=s.lastIndexOf('.');return i>0?s.substring(0,i):s;}

    private JButton button(String s,java.awt.event.ActionListener a){JButton b=new JButton(s);b.addActionListener(a);return b;}
    private JButton blank(){JButton b=new JButton();b.setVisible(false);return b;}
    private void row(JPanel p,GridBagConstraints g,int y,String label,JTextField f,JButton b){
        g.gridy=y;g.gridwidth=1;g.gridx=0;g.weightx=0;p.add(new JLabel(label),g);
        g.gridx=1;g.weightx=1;p.add(f,g);g.gridx=2;g.weightx=0;p.add(b,g);
    }
    private void append(String s){SwingUtilities.invokeLater(()->{log.append(s+"\n");log.setCaretPosition(log.getDocument().getLength());});}
    private void info(String s){JOptionPane.showMessageDialog(frame,s,"JAR → EXE Builder",JOptionPane.INFORMATION_MESSAGE);}
    private void error(String s,Exception e){append("ERROR: "+s+" - "+e.getMessage());JOptionPane.showMessageDialog(frame,s+"\n"+e.getMessage(),"Error",JOptionPane.ERROR_MESSAGE);}

    private static class DocumentListenerAdapter implements javax.swing.event.DocumentListener {
        private final Runnable r; DocumentListenerAdapter(Runnable r){this.r=r;}
        public void insertUpdate(javax.swing.event.DocumentEvent e){r.run();}
        public void removeUpdate(javax.swing.event.DocumentEvent e){r.run();}
        public void changedUpdate(javax.swing.event.DocumentEvent e){r.run();}
    }
}
