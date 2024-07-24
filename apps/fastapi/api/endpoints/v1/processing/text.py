import os

import fitz  # PyMuPDF
import pandas as pd


def process_pdf(file_path):
    """Extract text and form field data from a PDF using PyMuPDF."""
    # Open the PDF file
    document = fitz.open(file_path)
    text = ""

    # Iterate through each page of the PDF
    for page in document:
        # Extract text from the page and append to the text variable
        text += page.get_text()

    # Close the document
    document.close()

    return text


def process_csv(file_path):
    """Convert CSV data to a formatted string in a descriptive text format."""
    df = pd.read_csv(file_path)
    descriptive_text = []

    # Iterate over each row in the DataFrame
    for index, row in df.iterrows():
        # Build a descriptive string for each row
        row_description = []
        for field, value in row.items():
            if pd.notna(value):  # Only include fields with non-missing values
                # Format the field name by capitalizing each word and replace underscores with spaces
                formatted_field = " ".join(
                    word.capitalize() for word in field.replace("_", " ").split()
                )
                # Append the formatted description to the row description list
                row_description.append(f"{formatted_field}: {value}")
        # Join all descriptions in the row into a single string with periods separating them
        descriptive_text.append(". ".join(row_description) + ".")

    # Join all row descriptions into one large string separated by newlines
    return "\n".join(descriptive_text)


def consolidate_texts(base_folder_path):
    """Consolidate texts from CSVs and PDFs, ignoring specific files."""
    pdf_texts = []
    csv_texts = []
    documents_path = os.path.join(
        base_folder_path, "documents"
    )  # Path to the documents subfolder

    # Process files in the main directory
    for file_name in os.listdir(base_folder_path):
        if file_name == "Insurance.csv":
            print("Skipping Insurance.csv file")
            continue  # Skip the Insurance.csv file
        full_path = os.path.join(base_folder_path, file_name)
        if file_name.endswith(".pdf"):
            pdf_texts.append(process_pdf(full_path))
        elif file_name.endswith(".csv"):
            csv_texts.append(process_csv(full_path))

    # Process PDF files in the 'documents' subfolder
    if os.path.exists(documents_path):
        for file_name in os.listdir(documents_path):
            if file_name.endswith(".pdf"):
                full_path = os.path.join(documents_path, file_name)
                pdf_texts.append(process_pdf(full_path))

    # Join the PDF and CSV texts into a single string
    pdf_texts = "\n".join(pdf_texts)
    csv_texts = "\n".join(csv_texts)

    return pdf_texts, csv_texts


def combine_texts(pdf_content, csv_content):
    """
    Combine texts from consolidated PDFs and CSVs.

    Args:
    pdf_content (str): Text content from consolidated PDFs.
    csv_content (str): Text content from consolidated CSVs.

    Returns:
    str: Combined text content.
    """
    try:
        # Combine both contents, adding a newline if needed between the two contents
        combined_content = pdf_content + "\n\n" + csv_content

        return combined_content

    except Exception as e:
        print("An error occurred while combining texts:", e)
        raise e  # Raising the exception to be handled by the caller


def group_text_into_batches(file_stream, target_batch_size):
    """
    Processes text stream and groups it into batches, ensuring each batch does not exceed the target batch size in bytes.
    Each batch is a continuous blob of text.
    """
    batches = []
    current_batch = ""
    current_batch_size = 0

    for line in file_stream:
        line = line.strip()
        if not line:
            continue  # Skip empty lines
        resource_size = len(line.encode("utf-8"))

        if current_batch_size + resource_size + len("\n") <= target_batch_size:
            current_batch += ("" if current_batch == "" else "\n") + line
            current_batch_size += resource_size + len("\n")
        else:
            if current_batch:
                batches.append(current_batch)
            current_batch = line
            current_batch_size = resource_size

    if current_batch:
        batches.append(current_batch)

    return batches
