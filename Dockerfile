FROM python
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["gunicorn", "-w", "4", "-t","120", "-b", "0.0.0.0:8000", "app:app"]