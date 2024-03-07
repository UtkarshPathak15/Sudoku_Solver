#include<stdio.h>
#include<iostream>

using namespace std;

void Print(int board[][9],int n)
{
    for(int i=0;i<n;i++)
    {
    for(int j=0;j<n;j++)
    {
        cout<<board[i][j]<<" ";
    }
    cout<<"\n";
    }


}

bool isValid(int board[][9], int i,int j,int num)
{   

    for(int c=0;c<9;c++){
        if(board[i][c] == num || board[c][j] == num){
            return false;
        }
    }

    int si = i-i%3;
    int sj = j-j%3;
    for(int r=si;r<si+3;r++)
    {
        for(int c=sj;c<sj+3;c++)
        {
            if(board[r][c] == num){
            return false;
        }
        }
    }

    return true;
}

bool sudokuSolver(int board[][9],int i,int j,int n)
{
    if(i==n)
    {
    Print(board,n);
    return true;
    }

    if(j==n)
    {
    return sudokuSolver(board,i+1,0,n);
    }


    if(board[i][j]!=0)
    {
    return sudokuSolver(board,i,j+1,n);
    }

    for(int num=1 ; num<=9; num++)
    {
        if(isValid(board,i,j,num)){
            board[i][j] = num;
            bool subAns = sudokuSolver(board,i,j+1,n);
            if(subAns){
                return true;
            }
            // backtracking
            board[i][j] = 0;
        }
    }

    return false;
}

int main(){
    int board[9][9] ={
        {0,0,7,1,0,0,0,6,0},
        {1,0,5,2,0,8,0,0,0},
        {6,0,0,0,0,7,1,2,0},
        {3,1,2,4,0,5,0,0,8},
        {0,0,6,0,9,0,2,0,0},
        {0,0,0,0,0,3,0,0,1},
        {8,0,3,9,0,6,0,0,0},
        {0,6,0,0,8,2,7,0,3},

    };

    sudokuSolver(board,0,0,9);
}