# Makefile for School Management Backend

# Load environment variables if available
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Default shell
SHELL := /bin/bash

# Logs directory
LOG_DIR := .make/logs
$(shell mkdir -p $(LOG_DIR))

# Config file
CONFIG_FILE := config.yaml

# Extract values from config.yaml
REGISTRY := $(shell grep 'registry:' $(CONFIG_FILE) | awk '{print $$2}')
REPOSITORY := $(shell grep 'repository:' $(CONFIG_FILE) | awk '{print $$2}')
# Use TAG from config.yaml if available, otherwise fallback to git commit hash or latest
CONFIG_TAG := $(shell grep 'tag:' $(CONFIG_FILE) | awk '{print $$2}')
TAG := $(if $(CONFIG_TAG),$(CONFIG_TAG),$(shell git rev-parse --short HEAD 2>/dev/null || echo "latest"))
IMAGE_NAME := $(REGISTRY)/$(REPOSITORY):$(TAG)

# Colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RED    := $(shell tput -Txterm setaf 1)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: all migration build clean help

all: help

help:
	@echo "$(YELLOW)Available targets:$(RESET)"
	@echo "  $(GREEN)migration$(RESET)  - Run Prisma migration with interactive confirmation"
	@echo "  $(GREEN)build$(RESET)      - Build and push Docker image to GHCR"
	@echo "  $(GREEN)clean$(RESET)      - Remove local Docker images"

# ==============================================================================
# MIGRATION TARGET
# ==============================================================================
migration:
	@echo "$(YELLOW)[Migration] Starting migration process...$(RESET)"
	@mkdir -p $(LOG_DIR)
	@LOG_FILE="$(LOG_DIR)/migration_$(shell date +%Y%m%d%H%M%S).log"; \
	{ \
		echo "Timestamp: $$(date)"; \
		if ! command -v npx >/dev/null 2>&1; then \
			echo "$(RED)Error: npx is not installed.$(RESET)"; \
			exit 1; \
		fi; \
		if [ ! -f "prisma/schema.prisma" ]; then \
			echo "$(RED)Error: prisma/schema.prisma not found.$(RESET)"; \
			exit 1; \
		fi; \
		read -p "Have you already created the table in Prisma? (y/n) " answer; \
		case $$answer in \
			[Yy]* ) \
				echo "$(GREEN)Proceeding with migration...$(RESET)"; \
				MIGRATION_NAME="auto_migration_$$(date +%Y%m%d%H%M%S)"; \
				echo "Executing: npx prisma migrate dev --name $$MIGRATION_NAME"; \
				npx prisma migrate dev --name $$MIGRATION_NAME || exit 1; \
				echo "$(GREEN)Migration completed successfully.$(RESET)"; \
				;; \
			[Nn]* ) \
				echo "$(RED)Migration aborted by user.$(RESET)"; \
				exit 1; \
				;; \
			* ) \
				echo "$(RED)Invalid input. Aborting.$(RESET)"; \
				exit 1; \
				;; \
		esac; \
	} 2>&1 | tee -a "$$LOG_FILE"; \
	# Check exit code of the pipe chain \
	if [ $${PIPESTATUS[0]} -ne 0 ]; then exit 1; fi

# ==============================================================================
# BUILD TARGET
# ==============================================================================
build:
	@echo "$(YELLOW)[Build] Starting build process...$(RESET)"
	@mkdir -p $(LOG_DIR)
	@LOG_FILE="$(LOG_DIR)/build_$(shell date +%Y%m%d%H%M%S).log"; \
	{ \
		echo "Timestamp: $$(date)"; \
		echo "Registry: $(REGISTRY)"; \
		echo "Repository: $(REPOSITORY)"; \
		echo "Tag: $(TAG)"; \
		echo "Image: $(IMAGE_NAME)"; \
		\
		if [ -z "$(REGISTRY)" ] || [ -z "$(REPOSITORY)" ]; then \
			echo "$(RED)Error: Registry or Repository configuration missing in $(CONFIG_FILE).$(RESET)"; \
			exit 1; \
		fi; \
		\
		TOKEN="$$CR_PAT"; \
		if [ -z "$$TOKEN" ]; then \
			read -p "Have you configured the CR_PAT (GitHub PAT) environment variable? (y/n) " has_token; \
			case $$has_token in \
				[Nn]* ) \
					echo ""; \
					echo "$(YELLOW)=== GUIDE TO SETUP GITHUB CONTAINER REGISTRY (GHCR) TOKEN ===$(RESET)"; \
					echo "1. Open https://github.com/settings/tokens"; \
					echo "2. Click 'Generate new token (classic)'"; \
					echo "3. Name the token (e.g., ghcr-token)"; \
					echo "4. Check scopes: $(GREEN)write:packages$(RESET), $(GREEN)read:packages$(RESET), $(GREEN)delete:packages$(RESET)"; \
					echo "5. Scroll down and click 'Generate token'"; \
					echo "6. Copy the generated token (starts with ghp_...)"; \
					echo ""; \
					read -s -p "Insert CR_PAT: " input_token; \
					echo ""; \
					if [ -z "$$input_token" ]; then \
						echo "$(RED)Error: Token cannot be empty.$(RESET)"; \
						exit 1; \
					fi; \
					TOKEN="$$input_token"; \
					echo "$(GREEN)Token received. Proceeding with login...$(RESET)"; \
					;; \
				[Yy]* ) \
					echo "Okay, proceeding. Checking CR_PAT..."; \
					if [ -z "$$CR_PAT" ]; then \
						read -s -p "Insert CR_PAT: " input_token; \
						echo ""; \
						if [ -z "$$input_token" ]; then \
							echo "$(RED)Error: Token cannot be empty.$(RESET)"; \
							exit 1; \
						fi; \
						TOKEN="$$input_token"; \
					else \
						TOKEN="$$CR_PAT"; \
					fi; \
					;; \
				* ) \
					echo "$(RED)Invalid input.$(RESET)"; \
					exit 1; \
					;; \
			esac; \
		fi; \
		\
		if [ -n "$$TOKEN" ]; then \
			echo "Logging in to GHCR with provided token..."; \
			echo "$$TOKEN" | docker login $(REGISTRY) -u USERNAME --password-stdin || { \
				echo "$(RED)Error: Failed to login to GHCR.$(RESET)"; \
				exit 1; \
			}; \
		else \
			echo "$(YELLOW)Warning: CR_PAT env var not set. Assuming already logged in to $(REGISTRY).$(RESET)"; \
		fi; \
		\
		echo "Building Docker image..."; \
		docker build -t $(IMAGE_NAME) . || exit 1; \
		\
		echo "Pushing image to $(IMAGE_NAME)..."; \
		docker push $(IMAGE_NAME) || exit 1; \
		\
		echo "$(GREEN)Build and push completed successfully.$(RESET)"; \
		echo "Image: $(IMAGE_NAME)"; \
	} 2>&1 | tee -a "$$LOG_FILE"; \
	if [ $${PIPESTATUS[0]} -ne 0 ]; then exit 1; fi

# ==============================================================================
# CLEAN TARGET
# ==============================================================================
clean:
	@echo "$(YELLOW)[Clean] Cleaning up local images...$(RESET)"
	@mkdir -p $(LOG_DIR)
	@LOG_FILE="$(LOG_DIR)/clean_$(shell date +%Y%m%d%H%M%S).log"; \
	{ \
		if docker image inspect $(IMAGE_NAME) >/dev/null 2>&1; then \
			docker rmi $(IMAGE_NAME) || echo "$(YELLOW)Warning: Failed to remove image $(IMAGE_NAME)$(RESET)"; \
			echo "$(GREEN)Removed image $(IMAGE_NAME)$(RESET)"; \
		else \
			echo "Image $(IMAGE_NAME) not found locally."; \
		fi; \
	} 2>&1 | tee -a "$$LOG_FILE"
