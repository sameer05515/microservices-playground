package com.prem.duplicatefinder.repository;
import com.prem.duplicatefinder.entity.ScanJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ScanJobRepository extends JpaRepository<ScanJobEntity,String>{}
