createModel <- function(database ="productive", measurementName="orientation", classes=c("walking","sitting"), method="rpart2")
{
  library(influxdbr2)
  library(xts)
  library(caret)
  library(foreach)
  library(XML)
  library(pmml)
  
  influx<-influx_connection(host = "localhost",
                            port = 8086,
                            user = "",
                            pass = "")
  labels = lapply(classes, FUN=function(y) { paste("\"label\"='",y,"'",sep="") });
  query=paste("SELECT * FROM", measurementName, "WHERE", paste(labels,collapse=" OR "), "GROUP BY subject, label", sep = " ")
  result=influx_query_xts(influx, db=database, query= query)
  
  data=foreach(i=seq(1,length(result)),.combine=rbind) %do%
  {
    ts=result[[i]]
    r={}
    r$label=ts$tags$label
    r$subject=ts$tags$subject			
    foreach(w=split.xts(ts$values,f="millis",k=1000),.combine = rbind) %do%
    {
      r$alpha=mean(w$alpha)
      r$beta=mean(w$beta)
      r$gamma=mean(w$gamma)
      d3=sqrt((w$alpha-r$alpha)^2+(w$beta-r$beta)^2+(w$gamma-r$gamma)^2)
      r$mean=mean(d3)
      r$sd=sd(d3)
      r$max=max(d3)
      
      r$acc_x=mean(w$acc_x)
      r$acc_y=mean(w$acc_y)
      r$acc_z=mean(w$acc_z)
      d3=sqrt((w$acc_x-r$acc_x)^2+(w$acc_y-r$acc_y)^2+(w$acc_z-r$acc_z)^2)
      r$acc_mean=mean(d3)
      r$acc_sd=sd(d3)
      r$acc_max=max(d3)
      
      as.data.frame(r)
    }
  }
  
  data=na.omit(data)
  
  set.seed(1)
  holdout <- createDataPartition(data$label, p = .2, list = FALSE, times = 1)
  train<-data[-holdout,]
  test<-data[holdout,]
  
  ##Possibility 1: Separate feature selection and training
  #rfCtrl <- rfeControl(functions=rfFuncs, method="cv")
  #featureEvaluation <- rfe(data[,-c(1,2)], data[,1], sizes=c(1:12), rfeControl=rfCtrl)
  #train<-train[,c("label","subject", featureEvaluation$optVariables[1:5])]
  #model=train(train[,-c(1,2)], train[,"label"], method = method)
  #prediction=predict(model,test[,-c(1,2)])
  #print(varImp(model, scale=FALSE))
  #print(confusionMatrix(prediction,as.factor(test$label)))
  
  ##Possibility 2: Automatic feature selection while training
  train<-data[-holdout,]
  trainCtrl <- trainControl(method = "cv", classProbs = TRUE)
  model=train(train[,-c(1,2)], train[,"label"], method = method, trControl = trainCtrl)
  prediction=predict(model,test[,-c(1,2)])
  print(varImp(model, scale=FALSE))
  print(confusionMatrix(prediction,as.factor(test$label)))
  
  ##Posibility 3: Leave one subject out
  #subjects<-levels(factor(data$subject))
  #data_subject <- vector(mode = "list", length = nlevels(data$subject))
  #for(s in seq(1,nlevels(data$subject)))  data_subject[[s]]<- which(data$subject!=subjects[s])
  #trc = trainControl(index=data_subject)
  #model = train(data[,-c(1,2)], data$label, method = method, trControl=trc)
  #print(confusionMatrix(model))
  
  
  ##Possibility 4: Use PCA (data_pca contains standard features and the PCA values)
  #prep <- preProcess(data[,-c(1,2)],method=c("pca"))
  #data_pca=cbind(data,predict(prep,data[,-c(1,2)]))
  #set.seed(1)
  #holdout_pca <- createDataPartition(data_pca$label, p = .2, list = FALSE, times = 1)
  #train_pca<-data_pca[-holdout_pca,]
  #test_pca<-data_pca[holdout_pca,]
  #trainCtrl_pca <- trainControl(method = "cv", classProbs = TRUE)
  #model=train(train_pca[,-c(1,2)], train_pca[,"label"], method = method, trControl = trainCtrl_pca)
  #prediction_pca=predict(model,test_pca[,-c(1,2)])
  #print(varImp(model, scale=FALSE))
  #print(confusionMatrix(prediction_pca,as.factor(test_pca$label)))
  
  saveXML(pmml(model$finalModel),"classifier.pmml")
}