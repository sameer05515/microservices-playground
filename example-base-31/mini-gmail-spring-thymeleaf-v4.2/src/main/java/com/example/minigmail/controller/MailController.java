package com.example.minigmail.controller;

import com.example.minigmail.model.Email;
import com.example.minigmail.model.User;
import com.example.minigmail.security.AuthUser;
import com.example.minigmail.service.MailService;
import com.example.minigmail.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/mail")
public class MailController {
    private final MailService mailService;
    private final UserService userService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @GetMapping
    public String mailbox(@AuthenticationPrincipal AuthUser principal,
                          @RequestParam(defaultValue = "inbox") String box,
                          @RequestParam(defaultValue = "1") int page,
                          @RequestParam(defaultValue = "") String q,
                          Model model) {
        User user = principal.getUser();
        Page<Email> result = mailService.mailbox(user, box, page, q);
        model.addAttribute("box", box);
        model.addAttribute("q", q);
        model.addAttribute("emails", result);
        model.addAttribute("stats", mailService.stats(user));
        return "mailbox";
    }

    @GetMapping("/compose")
    public String compose(Model model,
                           @RequestParam(required = false) String draft) {
        if (draft != null) model.addAttribute("draftId", draft);
        return "compose";
    }

    @PostMapping("/send")
    public String send(@AuthenticationPrincipal AuthUser principal,
                       @RequestParam String to,
                       @RequestParam(required = false, defaultValue = "") String cc,
                       @RequestParam(required = false, defaultValue = "") String bcc,
                       @RequestParam(required = false, defaultValue = "") String subject,
                       @RequestParam(required = false, defaultValue = "") String body,
                       @RequestParam(required = false) MultipartFile[] attachments,
                       @RequestParam(required = false) String draftId) throws Exception {
        mailService.send(principal.getUser(), to, cc, bcc, subject, body, attachments, draftId, Path.of(uploadDir));
        return "redirect:/mail?box=inbox";
    }

    @PostMapping("/draft")
    public String draft(@AuthenticationPrincipal AuthUser principal,
                        @RequestParam(required = false, defaultValue = "") String to,
                        @RequestParam(required = false, defaultValue = "") String cc,
                        @RequestParam(required = false, defaultValue = "") String bcc,
                        @RequestParam(required = false, defaultValue = "") String subject,
                        @RequestParam(required = false, defaultValue = "") String body,
                        @RequestParam(required = false) MultipartFile[] attachments,
                        @RequestParam(required = false) String draftId) throws Exception {
        mailService.saveDraft(principal.getUser(), to, cc, bcc, subject, body, attachments, draftId, Path.of(uploadDir));
        return "redirect:/mail?box=drafts";
    }

    @GetMapping("/{id}")
    public String view(@AuthenticationPrincipal AuthUser principal,
                       @PathVariable String id,
                       Model model) {
        Email email = mailService.getVisible(id, principal.getUser());
        mailService.markRead(id, principal.getUser(), true);
        model.addAttribute("email", email);
        return "email";
    }

    @PostMapping("/{id}/read")
    public String read(@AuthenticationPrincipal AuthUser p, @PathVariable String id) {
        mailService.markRead(id, p.getUser(), true);
        return "redirect:/mail";
    }

    @PostMapping("/{id}/unread")
    public String unread(@AuthenticationPrincipal AuthUser p, @PathVariable String id) {
        mailService.markRead(id, p.getUser(), false);
        return "redirect:/mail";
    }

    @PostMapping("/{id}/star")
    public String star(@AuthenticationPrincipal AuthUser p, @PathVariable String id,
                       @RequestParam boolean value) {
        mailService.star(id, p.getUser(), value);
        return "redirect:/mail";
    }

    @PostMapping("/{id}/important")
    public String important(@AuthenticationPrincipal AuthUser p, @PathVariable String id,
                            @RequestParam boolean value) {
        mailService.important(id, p.getUser(), value);
        return "redirect:/mail";
    }

    @PostMapping("/{id}/trash")
    public String trash(@AuthenticationPrincipal AuthUser p, @PathVariable String id) {
        mailService.trash(id, p.getUser());
        return "redirect:/mail?box=trash";
    }

    @PostMapping("/{id}/restore")
    public String restore(@AuthenticationPrincipal AuthUser p, @PathVariable String id) {
        mailService.restore(id, p.getUser());
        return "redirect:/mail?box=inbox";
    }

    @PostMapping("/{id}/delete")
    public String delete(@AuthenticationPrincipal AuthUser p, @PathVariable String id) {
        mailService.deleteForever(id, p.getUser());
        return "redirect:/mail?box=trash";
    }

    @GetMapping("/{id}/reply")
    public String reply(@AuthenticationPrincipal AuthUser p, @PathVariable String id, Model model) {
        Email email = mailService.getVisible(id, p.getUser());
        User sender = userService.byId(email.getFromUserId());
        model.addAttribute("replyTo", sender.getEmail());
        model.addAttribute("subject", email.getSubject().startsWith("Re:") ? email.getSubject() : "Re: " + email.getSubject());
        model.addAttribute("body", "\n\n--- Original Message ---\n" + email.getBody());
        return "compose";
    }

    @GetMapping("/{id}/forward")
    public String forward(@AuthenticationPrincipal AuthUser p, @PathVariable String id, Model model) {
        Email email = mailService.getVisible(id, p.getUser());
        model.addAttribute("subject", email.getSubject().startsWith("Fwd:") ? email.getSubject() : "Fwd: " + email.getSubject());
        model.addAttribute("body", "\n\n--- Forwarded Message ---\n" + email.getBody());
        return "compose";
    }

    @GetMapping("/contacts/list")
    public String contacts(@AuthenticationPrincipal AuthUser p, Model model) {
        model.addAttribute("users", mailService.contacts(p.getUser()));
        return "contacts";
    }
}
