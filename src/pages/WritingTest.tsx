import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import TestHeader from "@/components/TestHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTestSession } from "@/hooks/useTestSession";
import { loadQuestions } from "@/utils/loadQuestions";
import type { WritingTest as WritingTestData } from "@/types/questions";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEYS = {
	task1Answer: "writing:task1:answer",
	task2Answer: "writing:task2:answer",
	task1Image: "writing:task1:image",
	task2Image: "writing:task2:image",
} as const;

const MIN_WORDS = {
	task1: 150,
	task2: 250,
} as const;

const calculateWordCount = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
};

const WritingTest = () => {
	const { testId } = useParams<{ testId: string }>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [test, setTest] = useState<WritingTestData | null>(null);
	const [loadingTest, setLoadingTest] = useState(true);
	const [task1Answer, setTask1Answer] = useState("");
	const [task2Answer, setTask2Answer] = useState("");
	const [task1ImageData, setTask1ImageData] = useState<string | null>(null);
	const [task2ImageData, setTask2ImageData] = useState<string | null>(null);
	const [showResultsModal, setShowResultsModal] = useState(false);
	const [validationMessages, setValidationMessages] = useState<string[]>([]);
	const [submittedAt, setSubmittedAt] = useState<string | null>(null);

	const durationMinutes = 60;

	const headerTitle = useMemo(() => {
		if (!test) return "IELTS Writing Test";
		if (test.testId) {
			const prettyId = test.testId.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
			return `IELTS Writing - ${prettyId || test.testId}`;
		}
		return "IELTS Writing Test";
	}, [test]);

	const clearStoredDrafts = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEYS.task1Answer);
			localStorage.removeItem(STORAGE_KEYS.task2Answer);
			localStorage.removeItem(STORAGE_KEYS.task1Image);
			localStorage.removeItem(STORAGE_KEYS.task2Image);
		} catch {
			// ignore storage errors
		}
	}, []);

	const resetLocalState = useCallback(() => {
		setTask1Answer("");
		setTask2Answer("");
		setTask1ImageData(null);
		setTask2ImageData(null);
		setValidationMessages([]);
		setSubmittedAt(null);
		setShowResultsModal(false);
	}, []);

	const session = useTestSession(durationMinutes, {
		onConfirmExit: () => {
			resetLocalState();
			clearStoredDrafts();
		},
	});

	useEffect(() => {
		if (!testId) {
			navigate("/mock-tests");
			return;
		}

		let cancelled = false;
		setLoadingTest(true);

		(async () => {
			try {
				const result = await loadQuestions("writing", testId);
				if (cancelled) return;
				setTest(result as WritingTestData);
			} catch (err) {
				console.error("Failed to load writing test", err);
				if (!cancelled) {
					toast({
						title: "Writing test unavailable",
						description: "We could not load this test. Please try another test or refresh the page.",
						variant: "destructive",
					});
					setTest(null);
				}
			} finally {
				if (!cancelled) setLoadingTest(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [testId, navigate, toast]);

	useEffect(() => {
		try {
			const savedTask1 = localStorage.getItem(STORAGE_KEYS.task1Answer);
			const savedTask2 = localStorage.getItem(STORAGE_KEYS.task2Answer);
			const savedImage1 = localStorage.getItem(STORAGE_KEYS.task1Image);
			const savedImage2 = localStorage.getItem(STORAGE_KEYS.task2Image);

			if (savedTask1) setTask1Answer(savedTask1);
			if (savedTask2) setTask2Answer(savedTask2);
			if (savedImage1) setTask1ImageData(savedImage1);
			if (savedImage2) setTask2ImageData(savedImage2);
		} catch {
			// ignore storage errors
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.task1Answer, task1Answer);
		} catch {
			// ignore storage errors
		}
	}, [task1Answer]);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.task2Answer, task2Answer);
		} catch {
			// ignore storage errors
		}
	}, [task2Answer]);

	useEffect(() => {
		if (task1ImageData) {
			try {
				localStorage.setItem(STORAGE_KEYS.task1Image, task1ImageData);
			} catch {
				// ignore storage errors
			}
		} else {
			try {
				localStorage.removeItem(STORAGE_KEYS.task1Image);
			} catch {
				// ignore storage errors
			}
		}
	}, [task1ImageData]);

	useEffect(() => {
		if (task2ImageData) {
			try {
				localStorage.setItem(STORAGE_KEYS.task2Image, task2ImageData);
			} catch {
				// ignore storage errors
			}
		} else {
			try {
				localStorage.removeItem(STORAGE_KEYS.task2Image);
			} catch {
				// ignore storage errors
			}
		}
	}, [task2ImageData]);

	const task1WordCount = useMemo(() => calculateWordCount(task1Answer), [task1Answer]);
	const task2WordCount = useMemo(() => calculateWordCount(task2Answer), [task2Answer]);

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, task: 1 | 2) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > 10 * 1024 * 1024) {
			toast({
				title: "File too large",
				description: "Please upload an image smaller than 10MB.",
				variant: "destructive",
			});
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : null;
			if (!result) {
				toast({
					title: "Failed to read file",
					description: "We could not process that image. Please try another file.",
					variant: "destructive",
				});
				return;
			}

			if (task === 1) {
				setTask1ImageData(result);
			} else {
				setTask2ImageData(result);
			}
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = (task: 1 | 2) => {
		if (task === 1) setTask1ImageData(null);
		if (task === 2) setTask2ImageData(null);
	};

	const handleSubmit = () => {
		if (!test) return;

		const issues: string[] = [];
		if (!task1ImageData && task1WordCount < MIN_WORDS.task1) {
			issues.push(`Task 1 needs at least ${MIN_WORDS.task1} words or an uploaded image.`);
		}
		if (!task2ImageData && task2WordCount < MIN_WORDS.task2) {
			issues.push(`Task 2 needs at least ${MIN_WORDS.task2} words or an uploaded image.`);
		}

		setValidationMessages(issues);

		if (issues.length > 0) {
			toast({
				title: "Check your responses",
				description: "Some tasks need more content before submitting.",
				variant: "destructive",
			});
			setShowResultsModal(true);
			return;
		}

		setSubmittedAt(new Date().toISOString());
		toast({
			title: "Draft saved",
			description: "Your responses are ready to review.",
		});
		setShowResultsModal(true);
	};

	const handleRedoTest = () => {
		resetLocalState();
		clearStoredDrafts();
		session.setTimeLeft(durationMinutes * 60);
		session.setStarted(false);
	};

	const handleExitToMockTests = () => {
		handleRedoTest();
		navigate("/mock-tests");
	};

	return (
		<div className="min-h-screen bg-background">
			<TestHeader title={headerTitle} session={session} />
			<main className="pt-32 sm:pt-24 pb-20">
				<div className="container mx-auto px-4 max-w-4xl">
					{loadingTest && <div className="text-center">Loading writing tasks...</div>}
					{!loadingTest && !test && <div className="text-center text-destructive">Failed to load writing tasks.</div>}

					{test && !session.started && (
						<Card className="p-8 text-center max-w-2xl mx-auto">
							<h2 className="text-2xl font-bold mb-4">IELTS Writing Practice</h2>
							<p className="text-muted-foreground mb-4">
								Complete Task 1 and Task 2 within {durationMinutes} minutes. You can type answers or upload handwritten responses.
							</p>
							<div className="text-left text-sm text-muted-foreground space-y-2 mb-6">
								<p>• Task 1: describe the visual information (minimum {MIN_WORDS.task1} words).</p>
								<p>• Task 2: present an argument or solution (minimum {MIN_WORDS.task2} words).</p>
								<p>• Progress saves locally so you can resume later.</p>
							</div>
							<Button size="lg" onClick={() => session.setStarted(true)}>
								Begin Test
							</Button>
						</Card>
					)}

					{test && session.started && (
						<div className="space-y-6">
							<AlertDialog open={showResultsModal} onOpenChange={setShowResultsModal}>
								<AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
									<AlertDialogHeader>
										<AlertDialogTitle className="text-2xl font-bold text-center">
											{validationMessages.length === 0 ? "Submission Ready" : "Review Required"}
										</AlertDialogTitle>
										<AlertDialogDescription asChild>
											<div className="space-y-6">
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<Card className="p-4 border border-muted-foreground/20">
														<div className="flex items-center gap-3">
															{task1ImageData || task1WordCount >= MIN_WORDS.task1 ? (
																<CheckCircle className="w-5 h-5 text-emerald-500" />
															) : (
																<AlertCircle className="w-5 h-5 text-amber-500" />
															)}
															<div>
																<p className="font-semibold">Task 1</p>
																<p className="text-sm text-muted-foreground">{task1WordCount} words</p>
															</div>
														</div>
													</Card>
													<Card className="p-4 border border-muted-foreground/20">
														<div className="flex items-center gap-3">
															{task2ImageData || task2WordCount >= MIN_WORDS.task2 ? (
																<CheckCircle className="w-5 h-5 text-emerald-500" />
															) : (
																<AlertCircle className="w-5 h-5 text-amber-500" />
															)}
															<div>
																<p className="font-semibold">Task 2</p>
																<p className="text-sm text-muted-foreground">{task2WordCount} words</p>
															</div>
														</div>
													</Card>
												</div>

												{submittedAt && validationMessages.length === 0 && (
													<div className="text-sm text-muted-foreground">
														Draft prepared on {new Date(submittedAt).toLocaleString()}.
													</div>
												)}

												{validationMessages.length > 0 && (
													<div className="space-y-2">
														{validationMessages.map((msg, idx) => (
															<div key={idx} className="flex items-start gap-2 text-sm text-amber-600">
																<AlertCircle className="w-4 h-4 mt-0.5" />
																<span>{msg}</span>
															</div>
														))}
													</div>
												)}

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													<Button variant="secondary" onClick={handleRedoTest}>
														Restart Test
													</Button>
													<Button onClick={handleExitToMockTests}>Back to Mock Tests</Button>
												</div>
											</div>
										</AlertDialogDescription>
									</AlertDialogHeader>
								</AlertDialogContent>
							</AlertDialog>

							<Card className="p-6 border-border">
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-2xl font-bold text-primary">Task 1</h2>
									<span className="text-sm text-muted-foreground">Minimum {MIN_WORDS.task1} words • 20 minutes</span>
								</div>
								<div className="p-4 bg-secondary/50 rounded-lg mb-6">
									<p className="text-card-foreground leading-relaxed">
										<strong>Prompt:</strong> {test.task1.prompt}
									</p>
									{test.task1.imageUrl && (
										<img src={test.task1.imageUrl} alt="Task 1 visual" className="mt-4 rounded-lg border" />
									)}
								</div>

								<label className="block text-sm font-medium text-card-foreground mb-2">Type your answer</label>
								<Textarea
									value={task1Answer}
									onChange={(e) => setTask1Answer(e.target.value)}
									placeholder="Type your Task 1 answer here (minimum 150 words)"
									className="min-h-[200px] font-mono text-base"
								/>
								<p className="text-sm text-muted-foreground mt-2">Word count: {task1WordCount}</p>

								<label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten answer</label>
								<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
									<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 1)} className="hidden" id="image-upload-1" />
									<label htmlFor="image-upload-1" className="cursor-pointer">
										<Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
										<p className="text-muted-foreground mb-2">{task1ImageData ? "Replace uploaded image" : "Click to upload image for Task 1"}</p>
										<p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
									</label>
									{task1ImageData && (
										<div className="mt-4 space-y-3">
											<img src={task1ImageData} alt="Task 1 upload" className="mx-auto max-w-full rounded" />
											<Button variant="outline" size="sm" onClick={() => handleRemoveImage(1)}>
												Remove image
											</Button>
										</div>
									)}
								</div>
							</Card>

							<Card className="p-6 border-border">
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-2xl font-bold text-primary">Task 2</h2>
									<span className="text-sm text-muted-foreground">Minimum {MIN_WORDS.task2} words • 40 minutes</span>
								</div>
								<div className="p-4 bg-secondary/50 rounded-lg mb-6">
									<p className="text-card-foreground leading-relaxed">
										<strong>Prompt:</strong> {test.task2.prompt}
									</p>
								</div>

								<label className="block text-sm font-medium text-card-foreground mb-2">Type your answer</label>
								<Textarea
									value={task2Answer}
									onChange={(e) => setTask2Answer(e.target.value)}
									placeholder="Type your Task 2 answer here (minimum 250 words)"
									className="min-h-[220px] font-mono text-base"
								/>
								<p className="text-sm text-muted-foreground mt-2">Word count: {task2WordCount}</p>

								<label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten answer</label>
								<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
									<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 2)} className="hidden" id="image-upload-2" />
									<label htmlFor="image-upload-2" className="cursor-pointer">
										<Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
										<p className="text-muted-foreground mb-2">{task2ImageData ? "Replace uploaded image" : "Click to upload image for Task 2"}</p>
										<p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
									</label>
									{task2ImageData && (
										<div className="mt-4 space-y-3">
											<img src={task2ImageData} alt="Task 2 upload" className="mx-auto max-w-full rounded" />
											<Button variant="outline" size="sm" onClick={() => handleRemoveImage(2)}>
												Remove image
											</Button>
										</div>
									)}
								</div>
							</Card>

							<div className="flex flex-col sm:flex-row justify-end gap-3">
								<Button variant="outline" onClick={handleExitToMockTests}>
									Exit Test
								</Button>
								<Button size="lg" onClick={handleSubmit} className="sm:w-auto">
									<CheckCircle className="w-5 h-5 mr-2" />
									Submit Answers
								</Button>
							</div>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default WritingTest;
