package com.prem.duplicatefinder.controller;
import com.prem.duplicatefinder.model.*;import com.prem.duplicatefinder.service.FileOperationService;import jakarta.validation.Valid;import org.springframework.web.bind.annotation.*;import java.util.List;
@RestController @RequestMapping("/api/files") public class FileController{
 private final FileOperationService s;public FileController(FileOperationService s){this.s=s;}
 @GetMapping("/browse")public List<FolderEntry>browse(@RequestParam String path)throws Exception{return s.browse(path);}
 @DeleteMapping public OperationResult delete(@Valid @RequestBody FileOperationRequest r){return s.delete(r.paths());}
 @PostMapping("/move")public OperationResult move(@Valid @RequestBody MoveRequest r){return s.move(r.paths(),r.targetDirectory());}
}
