"""Repo-relative paths. Run engine scripts from a video's edit/ or shorts/ folder."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB=os.path.join(ROOT,'library')+'/'
FONTS=os.path.join(ROOT,'fonts')+'/'
# SU_VIDEO = the video folder (e.g. videos/V05). Defaults to the parent of the current folder.
VIDEO=os.path.abspath(os.environ.get('SU_VIDEO',os.path.join(os.getcwd(),'..')))+'/'
VO=VIDEO+'vo/'
