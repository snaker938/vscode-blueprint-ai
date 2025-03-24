// ImageGenerationModal.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  Text,
  DefaultButton,
  PrimaryButton,
  TextField,
  Pivot,
  PivotItem,
  Stack,
  IconButton,
  Spinner,
  TooltipHost,
  Link,
} from '@fluentui/react';
import styled from 'styled-components';

// ---------- STYLES ----------

const OpenButtonContainer = styled.div`
  margin: 20px 0;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  width: 650px;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  border: 1px solid #d9d9d9;
`;

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ButtonsRow = styled(Stack)`
  margin-top: 20px;
  justify-content: flex-end;
  gap: 10px;
`;

const AdvancedSettingsContainer = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  background-color: #f8f8f8;
`;

const DragDropArea = styled.div<{ isDraggingOver: boolean }>`
  border: ${({ isDraggingOver }) =>
    isDraggingOver ? '2px dashed #0078d4' : '2px dashed #ccc'};
  padding: 30px;
  text-align: center;
  border-radius: 6px;
  transition: border 0.3s;
  cursor: pointer;
  font-size: 14px;
  color: #666;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const AiTabContainer = styled.div`
  padding: 10px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #eee;
`;

// Mini sub-modal (help/instructions) container
const SubModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  /* Ensures the sub-modal stays above the Fluent UI Modal */
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubModalContent = styled.div`
  background: #fff;
  padding: 20px;
  width: 400px;
  border-radius: 6px;
`;

// ---------- COMPONENT ----------

export const ImageGenerationModal: React.FC = () => {
  // 1) Internal open/close state (no external props needed)
  const [isOpen, setIsOpen] = useState(false);

  // 2) & 8) Image handling + storing last used image name
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // 4) & 7) AI prompt + recommended prompts + store to localStorage
  const [aiPrompt, setAiPrompt] = useState('');
  const [promptError, setPromptError] = useState<string | null>(null);

  // 5) Collapsible advanced settings
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // 6) Character count
  const maxPromptLength = 200;

  // 10) A help "?" button that opens a mini sub-modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  // 11) Close confirmation if user has unsaved data
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  // 12) Drag-and-drop area
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // 13) "Clear" button to reset the AI prompt
  // 14) & 15) File size limit & invalid file type
  const maxFileSize = 5 * 1024 * 1024; // 5MB limit

  // 17) "Reset to Defaults" inside advanced settings
  const [aiStyle, setAiStyle] = useState('Realistic');
  const [aiSize, setAiSize] = useState('512x512');
  const [aiNumber, setAiNumber] = useState(1);

  // 18) Spinner/loading simulation
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Removed theme toggle. We are always in light mode. ---

  // Load last used prompt / file name from localStorage
  useEffect(() => {
    const savedPrompt = localStorage.getItem('lastAiPrompt') || '';
    setAiPrompt(savedPrompt);

    const savedFileName = localStorage.getItem('lastFileName');
    if (savedFileName) {
      console.log(`Previously uploaded file: ${savedFileName}`);
    }
  }, []);

  /**
   * processSelectedFile wrapped in `useCallback`
   * so we can safely include it as a dependency in useEffect.
   */
  const processSelectedFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setFileError('Please upload a valid image file.');
        setSelectedFile(null);
        setImagePreviewUrl(null);
        return;
      }
      if (file.size > maxFileSize) {
        setFileError('File size exceeds the 5MB limit.');
        setSelectedFile(null);
        setImagePreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      setFileError(null);

      // For preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Save file name to localStorage
      localStorage.setItem('lastFileName', file.name);
    },
    [maxFileSize, setFileError, setSelectedFile, setImagePreviewUrl]
  );

  // Setup drag & drop listeners
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        processSelectedFile(e.dataTransfer.files[0]);
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [processSelectedFile]);

  /** Open the modal */
  const openModal = () => {
    setIsOpen(true);
  };

  /** Attempt to close, possibly showing confirmation if user has unsaved data */
  const requestCloseModal = () => {
    if (selectedFile || aiPrompt) {
      setShowCloseConfirmation(true);
    } else {
      setIsOpen(false);
    }
  };

  const confirmCloseModal = () => {
    setShowCloseConfirmation(false);
    setIsOpen(false);
  };

  const cancelCloseModal = () => {
    setShowCloseConfirmation(false);
  };

  /** Handler for file input changes (upload button click). */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0]) return;
    processSelectedFile(event.target.files[0]);
  };

  /** Remove selected image */
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setFileError(null);
  };

  /** AI prompt changes; store in localStorage */
  const handlePromptChange = (val: string) => {
    setAiPrompt(val);
    setPromptError(null);
    localStorage.setItem('lastAiPrompt', val);
  };

  /** Clear the AI prompt */
  const handleClearPrompt = () => {
    setAiPrompt('');
    setPromptError(null);
    localStorage.removeItem('lastAiPrompt');
  };

  /** Upload tab "Confirm" */
  const handleUploadConfirm = () => {
    if (!selectedFile) {
      setFileError('No file selected to upload.');
      return;
    }
    alert(`Pretending to upload file: ${selectedFile.name}`);
    // Your real upload logic here.
  };

  /** AI Generation tab "Confirm" */
  const handleAIGenerateConfirm = () => {
    if (!aiPrompt.trim()) {
      setPromptError('Prompt cannot be empty.');
      return;
    }
    if (aiPrompt.length < 10) {
      setPromptError('Prompt is too short. Provide more details!');
      return;
    }
    setIsGenerating(true);
    // Simulate generation with setTimeout
    setTimeout(() => {
      setIsGenerating(false);
      alert(`AI is generating with prompt: "${aiPrompt}"
Style: ${aiStyle}, Size: ${aiSize}, Variations: ${aiNumber}`);
    }, 1500);
  };

  /** Toggle advanced settings (collapse/expand) */
  const handleToggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  /** Reset advanced settings to defaults */
  const handleResetAdvancedSettings = () => {
    setAiStyle('Realistic');
    setAiSize('512x512');
    setAiNumber(1);
  };

  const recommendedPrompts = [
    'A sunset over a futuristic city',
    'Cute cartoon puppy riding a skateboard',
    'A photorealistic portrait of a medieval knight',
    'Abstract shapes in neon colors',
  ];

  return (
    <>
      {/* The button to open modal */}
      <OpenButtonContainer>
        <DefaultButton text="Open Image Generation Modal" onClick={openModal} />
      </OpenButtonContainer>

      <Modal
        isOpen={isOpen}
        onDismiss={requestCloseModal}
        isBlocking={false}
        containerClassName="modalContainer"
      >
        <ModalContent>
          <TitleBar>
            <Text variant="xLarge" styles={{ root: { color: '#4b3f72' } }}>
              Add an Image
            </Text>
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              {/* "How it works" button (fixed icon) */}
              <IconButton
                iconProps={{ iconName: 'Help' }}
                onClick={() => setShowHelpModal(true)}
                title="How it works"
                ariaLabel="How it works"
              />
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={requestCloseModal}
                ariaLabel="Close modal"
              />
            </Stack>
          </TitleBar>

          <Pivot>
            {/* ---------- UPLOAD TAB ---------- */}
            <PivotItem headerText="Upload Image">
              <Stack tokens={{ childrenGap: 10 }}>
                {/* Drag-and-drop area: hide it if there's already an image */}
                {!selectedFile && (
                  <DragDropArea
                    ref={dropRef}
                    isDraggingOver={isDraggingOver}
                    onClick={() =>
                      document.getElementById('imageUploadInput')?.click()
                    }
                  >
                    {isDraggingOver
                      ? 'Drop your file here'
                      : 'Drag & drop or click to select an image'}
                  </DragDropArea>
                )}

                <input
                  id="imageUploadInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {fileError && (
                  <Text variant="small" style={{ color: 'red' }}>
                    {fileError}
                  </Text>
                )}

                {selectedFile && (
                  <ImagePreviewContainer>
                    {imagePreviewUrl && <ImagePreview src={imagePreviewUrl} />}
                    <div>
                      <Text variant="small">
                        Selected: {selectedFile.name} (
                        {(selectedFile.size / 1024).toFixed(2)} KB)
                      </Text>
                    </div>
                    <IconButton
                      iconProps={{ iconName: 'Delete' }}
                      onClick={removeImage}
                      title="Remove image"
                    />
                  </ImagePreviewContainer>
                )}

                <ButtonsRow horizontal>
                  <DefaultButton text="Close" onClick={requestCloseModal} />
                  <PrimaryButton text="Upload" onClick={handleUploadConfirm} />
                </ButtonsRow>
              </Stack>
            </PivotItem>

            {/* ---------- AI GENERATION TAB ---------- */}
            <PivotItem headerText="Generate with AI">
              <AiTabContainer>
                <Stack tokens={{ childrenGap: 12 }}>
                  <TooltipHost content="Enter your prompt for the AI to generate an image.">
                    <Text variant="small" style={{ fontWeight: 600 }}>
                      Describe your desired image (max {maxPromptLength} chars):
                    </Text>
                  </TooltipHost>

                  <TextField
                    placeholder="e.g. 'A sunset over a futuristic city...'"
                    value={aiPrompt}
                    onChange={(_, val) => handlePromptChange(val || '')}
                    multiline
                    autoAdjustHeight
                    maxLength={maxPromptLength}
                  />
                  {promptError && (
                    <Text variant="small" style={{ color: 'red' }}>
                      {promptError}
                    </Text>
                  )}

                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                  >
                    <Text variant="small">
                      {aiPrompt.length} / {maxPromptLength} characters
                    </Text>
                    <DefaultButton
                      text="Clear prompt"
                      onClick={handleClearPrompt}
                    />
                  </Stack>

                  {/* Recommended prompts */}
                  <Stack>
                    <Text variant="small" style={{ fontWeight: 600 }}>
                      Try a recommended prompt:
                    </Text>
                    <Stack horizontal tokens={{ childrenGap: 6 }}>
                      {recommendedPrompts.map((r, idx) => (
                        <DefaultButton
                          key={idx}
                          text={r}
                          styles={{ root: { padding: '0 6px' } }}
                          onClick={() => handlePromptChange(r)}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  {/* Collapsible advanced settings */}
                  <DefaultButton
                    text={
                      showAdvancedSettings
                        ? 'Hide Advanced Settings'
                        : 'Show Advanced Settings'
                    }
                    onClick={handleToggleAdvancedSettings}
                    styles={{
                      root: { marginTop: '10px' },
                    }}
                  />
                  {showAdvancedSettings && (
                    <AdvancedSettingsContainer>
                      <Stack horizontal horizontalAlign="end">
                        <Link onClick={handleResetAdvancedSettings}>
                          Reset to defaults
                        </Link>
                      </Stack>
                      <Stack tokens={{ childrenGap: 10 }}>
                        <div>
                          <TooltipHost content="Style for the AI to emulate (e.g., Realistic, Cartoon, Abstract...)">
                            <Text variant="small" style={{ fontWeight: 600 }}>
                              Style:
                            </Text>
                          </TooltipHost>
                          <TextField
                            value={aiStyle}
                            onChange={(_, val) => setAiStyle(val || '')}
                          />
                        </div>
                        <div>
                          <TooltipHost content="Size of the generated image. Some AI providers limit sizes.">
                            <Text variant="small" style={{ fontWeight: 600 }}>
                              Size:
                            </Text>
                          </TooltipHost>
                          <TextField
                            value={aiSize}
                            onChange={(_, val) => setAiSize(val || '')}
                          />
                        </div>
                        <div>
                          <TooltipHost content="Number of variations to generate (1-4 recommended).">
                            <Text variant="small" style={{ fontWeight: 600 }}>
                              Variations:
                            </Text>
                          </TooltipHost>
                          <TextField
                            type="number"
                            value={String(aiNumber)}
                            onChange={(_, val) => setAiNumber(Number(val) || 1)}
                            min="1"
                            max="10"
                            styles={{ field: { width: 60 } }}
                          />
                        </div>
                      </Stack>
                    </AdvancedSettingsContainer>
                  )}

                  <ButtonsRow horizontal>
                    <DefaultButton text="Close" onClick={requestCloseModal} />
                    <PrimaryButton
                      text={isGenerating ? 'Generating...' : 'Generate'}
                      onClick={handleAIGenerateConfirm}
                      disabled={isGenerating}
                    />
                  </ButtonsRow>

                  {isGenerating && (
                    <Stack horizontalAlign="center" style={{ marginTop: 10 }}>
                      <Spinner label="AI is generating your image..." />
                    </Stack>
                  )}
                </Stack>
              </AiTabContainer>
            </PivotItem>
          </Pivot>
        </ModalContent>
      </Modal>

      {/* Help sub-modal */}
      {showHelpModal && (
        <SubModalOverlay>
          <SubModalContent>
            <Text variant="large" block style={{ marginBottom: 10 }}>
              How It Works
            </Text>
            <Text block style={{ marginBottom: 10 }}>
              1. Upload any image and click "Upload" to use it in your designs.
              <br />
              2. Or switch to the "Generate with AI" tab to describe an image,
              choose advanced settings, and click "Generate."
            </Text>
            <Text block style={{ marginBottom: 10 }}>
              This is just a sample help window. Customize it for your own
              instructions!
            </Text>
            <PrimaryButton onClick={() => setShowHelpModal(false)}>
              OK
            </PrimaryButton>
          </SubModalContent>
        </SubModalOverlay>
      )}

      {/* Close confirmation dialog */}
      {showCloseConfirmation && (
        <SubModalOverlay>
          <SubModalContent>
            <Text variant="mediumPlus" block style={{ marginBottom: 10 }}>
              Are you sure you want to close?
            </Text>
            <Text block style={{ marginBottom: 10 }}>
              You may lose any unsaved changes. Proceed anyway?
            </Text>
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              horizontalAlign="end"
            >
              <DefaultButton text="Cancel" onClick={cancelCloseModal} />
              <PrimaryButton text="Close" onClick={confirmCloseModal} />
            </Stack>
          </SubModalContent>
        </SubModalOverlay>
      )}
    </>
  );
};
